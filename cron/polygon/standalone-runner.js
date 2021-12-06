const hre = require("hardhat");
const fs = require('fs');

const IERC20Abi = require("./abi/IERC20Upgradeable.json");
const IControllerV1Abi = require("./abi/Controller.json");
const vaultAbi = require("./abi/Vault.json");
const { web3 } = require("hardhat");
const settings = require("./settings.json");

// logic control
const nextVault = require("./next-vault.json");
const vaultDecision = require("./vault-decision.json");
const { randomInt } = require("crypto");

const ethers = hre.ethers;

// Only execute the `doHardWork` when
// the profit share is `greatDealRatio` times better than the gas cost in Ether
const greatDealRatio = 6;
// or when the funds available for invest is 1/(idleFraction) of the total funds.
// note that funds that are available for invest are different from funds sitting in vault
const idleFraction = 20;
const bedBot = "0xbed04c43e74150794f2ff5b62b4f73820edaf661";

const addresses = require('../../../harvest-api/data/mainnet/addresses.json').MATIC;
const allVaults = Object.keys(addresses.V2);

const disableCron = vaultAddress => Object.keys(addresses.V2).find(
  key => (addresses.V2[key].NewVault && addresses.V2[key].NewVault.toLowerCase() === vaultAddress.toLowerCase())
  && (addresses.V2[key].doHardwork === false)
);

const onlyProfit = vaultAddress => Object.keys(addresses.V2).find(
  key => (addresses.V2[key].NewVault && addresses.V2[key].NewVault.toLowerCase() === vaultAddress.toLowerCase())
  && (addresses.V2[key].doHardwork === "onlyProfit")
);

const vaultIds = allVaults
  .filter(vaultId => addresses.V2[vaultId].NewVault)
  .filter(vault => !disableCron(addresses.V2[vault].NewVault));

const vaults = vaultIds.map(vaultId => addresses.V2[vaultId].NewVault);


// input vault key and output next vault key in the list
function findNextVaultKey(curVault) {
  let id = vaultIds.findIndex( (element => element == curVault) );
  let nextId;

  if(id == vaultIds.length-1){
    nextId = 0;
  } else {
    nextId = id + 1;
  }
  return vaultIds[nextId];
}

async function roughQuoteXInMATIC(xAmount, xAddress, xMATICLPPair) {
  console.log(xAmount);
  console.log(xAddress);
  console.log(xMATICLPPair);

  var x = new web3.eth.Contract(IERC20Abi, xAddress);
  var matic = new web3.eth.Contract(IERC20Abi, addresses.WMATIC);

  let xInPair = await x.methods.balanceOf(xMATICLPPair).call();
  let maticInPair = await matic.methods.balanceOf(xMATICLPPair).call();

  // Use a very rough calculation. This would be erroneous when the farmAmount is large.
  // However this should be fine for our purposes.
  let maticOut = (maticInPair / xInPair) * xAmount;

  return maticOut;
}

// determines the gas price by taking the minimum of "locally set max gas" and the gas price returned from api
async function getGasPrice() {
    return 65000000000; // 10 gwei in BSC
}

// properly setup the txSenderInfo for sending
async function formulateTxSenderInfo(sender) {
  let submitGasPrice = await getGasPrice();
  let nonce = await web3.eth.getTransactionCount(sender);

  console.log("gasPrice: ", submitGasPrice);

  const txSenderInfo = {gasPrice: submitGasPrice, gas: settings.gasLimit, nonce, from: sender};
  return txSenderInfo;
}

// helper functions
// wait for ms
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// return a random number between min and max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let curVaultKey = nextVault.next_vault_key;
var controller = new web3.eth.Contract(IControllerV1Abi, addresses.Controller);
var profitShareAddr = addresses.ProfitShareTarget;
let vaultAddress = addresses.V2[curVaultKey].NewVault;
let rewardPoolAddress = addresses.V2[curVaultKey].NewPool;
let vault = new web3.eth.Contract(vaultAbi, vaultAddress);
let eth = new web3.eth.Contract(IERC20Abi, addresses.pWETH);

async function main() {
  await hre.run('compile');
  const accounts = await ethers.getSigners();
  console.log("==================================================================");
  
  if(process.env.HARDHAT_NETWORK == "hardhat") {
    let txSenderInfo = await formulateTxSenderInfo(bedBot);
    console.log("Executor: ", bedBot);
    console.log("SIMULATION");
    console.log("Doing simulation on vault ", curVaultKey);
    console.log("Vault Address: ", vaultAddress);

    currentSimBlock = await web3.eth.getBlockNumber()
    console.log("Fresh simulation: ", currentSimBlock);

    // Simulate with
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [bedBot]}
    )

    let decision;
    let executeFlag = false;
    let availableToInvestOut = await vault.methods.availableToInvestOut().call();
    let underlyingBalanceWithInvestment = await vault.methods.underlyingBalanceWithInvestment().call();

    console.log("[ Do we need to push funds? ]");
    console.log("vault investment ratio: ",
      await vault.methods.vaultFractionToInvestNumerator().call(),
      "/",
      await vault.methods.vaultFractionToInvestDenominator().call(),
    );

    var underlying = new web3.eth.Contract(IERC20Abi, await vault.methods.underlying().call());
    let underlyingInVault = await underlying.methods.balanceOf(vaultAddress).call();
    console.log("underlying in vault:     ", underlyingInVault);
    console.log("AUM:                     ", underlyingBalanceWithInvestment);
    console.log("available to invest out: ", availableToInvestOut);

    if( availableToInvestOut > underlyingBalanceWithInvestment / idleFraction) {
      console.log("====> need to PUSH funds ====>");
      executeFlag = true;
    } else {
      console.log(".... funds don't need to be pushed");
    }
    ethInProfitShareBefore = await eth.methods.balanceOf(profitShareAddr).call();
    if(executeFlag == false) {
      console.log("======= Doing hardwork ======");
      console.time('doHardwork simulation');
      let tx = await controller.methods.doHardWork(vaultAddress).send(txSenderInfo);
      console.timeEnd('doHardwork simulation');

      let maticCost = tx.gasUsed * txSenderInfo.gasPrice;
      let ethInProfitShareAfter = await eth.methods.balanceOf(profitShareAddr).call();
      let ethProfit = ethInProfitShareAfter - (ethInProfitShareBefore);
      let roughProfitInMatic = await roughQuoteXInMATIC(ethProfit, addresses.pWETH, addresses.V2["quickswap_ETH_MATIC"].Underlying)

      console.log("gasUsed:            ", tx.gasUsed);
      console.log("profit in Matic:    ", roughProfitInMatic/1e18);
      console.log("Matic cost:         ", maticCost/1e18);

      console.log("[ Is the profit share good enough? ]");
      console.log("before:             ",  ethInProfitShareBefore);
      console.log("after:              ",  ethInProfitShareAfter);
      console.log("profit shared Ether: ", ethProfit/1e18);

      if(roughProfitInMatic > maticCost * greatDealRatio) {
        console.log("====> Time to doHardwork! ====");
        executeFlag = true;
      } else {
        console.log("............................. bad deal");
      }
    }

    if(disableCron(vaultAddress)){
      console.log("..........[FORCED SKIP]");
      executeFlag = false;
    }

    decision = {
      vaultKey: curVaultKey,
      execute: executeFlag
    };

    fs.writeFileSync("./vault-decision.json", JSON.stringify(decision), "utf-8");
    console.log("Decision wrote in file.");
  } else if(process.env.HARDHAT_NETWORK == "cron_mainnet") {
    let hardworker = accounts[0].address;
    let txSenderInfo = await formulateTxSenderInfo(hardworker); 
    console.log("Executor: ", hardworker);
    console.log("cron_mainnet");

    // vaultDecision is read when the script is first started.
    if(vaultDecision.vaultKey != curVaultKey) {
      console.log("ERROR: decision file info doesn't match vault key, exiting...");
      return;
    }

    if (vaultDecision.execute) {
      console.log("Mainnet: Sending the tx of ", vaultDecision.vaultKey);
      try {
        let tx = await controller.methods.doHardWork(vaultAddress).send(txSenderInfo);
      } catch (e) {
        console.log("Error when sending tx: ");
        console.log(e);
      }
    } else {
      console.log("Mainnet: NOT sending the tx of ", vaultDecision.vaultKey);
    }

    let nextVaultKey = findNextVaultKey(curVaultKey);
    let isLastVault = (curVaultKey == vaultIds[vaultIds.length-1]);
    let newNextVault = {
      next_vault_key: nextVaultKey
    };
    fs.writeFileSync("./next-vault.json", JSON.stringify(newNextVault), "utf-8");
    console.log("NEXT Vault:", nextVaultKey);

    if(isLastVault) {
      // Simulate and execute again in 5 hrs
      console.log("Waiting for 5 hrs for the next round");
      await sleep(5 * 60 * 60 * 1000);
    } else {
      let waitFor = getRandomInt(1000 * 60 , 1000 * 60 * 2);
      console.log("Waiting for: ", waitFor);
      await sleep(waitFor);
    }
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
