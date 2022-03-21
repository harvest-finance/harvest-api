const PotPoolAbi = require('./abi/PotPool.json')
const ERC20Abi = require('./abi/ERC20.json')
const NotifyHelperStatefulAbi = require('./abi/NotifyHelperStateful.json')
const GlobalIncentivesHelperAbi = require('./abi/GlobalIncentivesHelper.json')
const StatefulEmissionHelperAbi = require('./abi/StatefulEmissionHelper.json')
const FeeRewardForwarderAbi = require('./abi/FeeRewardForwarder.json')
const MinterHelperAbi = require('./abi/MinterHelper.json')
const MinterExecutorAbi = require('./abi/MinterExecutor.json')
const GlobalIncentivesExecutorAbi = require('./abi/GlobalIncentivesExecutor.json')
const DelayMinterAbi = require('./abi/DelayMinter.json')
const BigNumber = require('bignumber.js')

/* global hre */

function to18(number) {
  return new BigNumber(number).multipliedBy('1000000000000000000').toFixed()
}

function toReadable(amount) {
  return new BigNumber(amount).dividedBy('1000000000000000000').toFixed()
}

async function formulateTxSenderInfo() {
  const settings = require('./settings.json')
  const accounts = await hre.ethers.getSigners()
  const sender = accounts[0].address
  const nonce = await hre.web3.eth.getTransactionCount(sender)

  const txSenderInfo = { gasPrice: settings.gasPrice, gas: settings.gasLimit, nonce, from: sender }
  return txSenderInfo
}

async function getBalance(tokenAddress, userAddress) {
  let tokenInstance = new hre.web3.eth.Contract(ERC20Abi, tokenAddress)
  return new BigNumber(await tokenInstance.methods.balanceOf(userAddress).call()).toFixed()
}

async function printStatsParametrized(
  globalIncentivesHelperAddress,
  primaryAssetName,
  rewardTokenAddresses,
  rewardTokenNames,
) {
  const accounts = await hre.ethers.getSigners()
  const sender = accounts[0].address
  console.log('Sender address:', sender)
  let maticBalance = new BigNumber(await hre.web3.eth.getBalance(sender)).toFixed()
  console.log(`Sender ${primaryAssetName} balance: ${maticBalance} [${toReadable(maticBalance)}]`)

  for (let i = 0; i < rewardTokenAddresses.length; i++) {
    let tokenInstance = new hre.web3.eth.Contract(ERC20Abi, rewardTokenAddresses[i])
    let rewardTokenName = rewardTokenNames[i]
    let senderInitialBalance = new BigNumber(
      await tokenInstance.methods.balanceOf(sender).call(),
    ).toFixed()
    console.log(
      `Sender's ${rewardTokenName} balance: ${senderInitialBalance} [${toReadable(
        senderInitialBalance,
      )}]`,
    )
    let notifierBalance = new BigNumber(
      await tokenInstance.methods.balanceOf(globalIncentivesHelperAddress).call(),
    ).toFixed()
    console.log(
      `Notifier ${rewardTokenName} balance: ${notifierBalance} [${toReadable(notifierBalance)}]`,
    )
  }
}

async function updateRewardDistributionAsNeeded(notifyHelperRegularAddress, emissionItems) {
  // whitelist generic helper on the pools
  for (let i = 0; i < emissionItems.length; i++) {
    let item = emissionItems[i]
    let poolContract = new hre.web3.eth.Contract(PotPoolAbi, item.address)
    console.log('Checking reward distribution for', item.address)
    if (!(await poolContract.methods.rewardDistribution(notifyHelperRegularAddress).call())) {
      console.log('Not reward distribution for ', item.address, 'Setting it...')
      await poolContract.methods
        .setRewardDistribution([notifyHelperRegularAddress], true)
        .send(await formulateTxSenderInfo())
    }
    console.log('Done')
  }
}

async function notifyPools(incentivesHelperAddress, tokenAddresses, amounts, timestamp) {
  let globalIncentivesHelper = new hre.web3.eth.Contract(
    GlobalIncentivesHelperAbi,
    incentivesHelperAddress,
  )
  await globalIncentivesHelper.methods
    .notifyPools(tokenAddresses, amounts, timestamp)
    .send(await formulateTxSenderInfo())
}

async function appendMints(minterAddress, amounts, targets, timestamps) {
  let minter = new hre.web3.eth.Contract(MinterHelperAbi, minterAddress)
  await minter.methods.appendMints(amounts, targets, timestamps).send(await formulateTxSenderInfo())
}

async function transferGovernance(minterAddress, addr, newStorage) {
  let minter = new hre.web3.eth.Contract(MinterHelperAbi, minterAddress)
  await minter.methods.transferGovernance(addr, newStorage).send(await formulateTxSenderInfo())
}

async function executeMint(minterAddress, mintId, announceNext) {
  let minter = new hre.web3.eth.Contract(MinterHelperAbi, minterAddress)
  await minter.methods.execute(mintId, announceNext).send(await formulateTxSenderInfo())
}

async function execute(minterOrIncentivesExecutorAddress) {
  let minterExecutor = new hre.web3.eth.Contract(
    MinterExecutorAbi,
    minterOrIncentivesExecutorAddress,
  )
  await minterExecutor.methods.execute().send(await formulateTxSenderInfo())
}

async function getCurrentMintId(minterExecutorAddress) {
  let minterExecutor = new hre.web3.eth.Contract(MinterExecutorAbi, minterExecutorAddress)
  return await minterExecutor.methods.currentMintId().call()
}

async function updateTotals(globalIncentivesExecutorAddress, tokens, totals, timestamp) {
  let minterExecutor = new hre.web3.eth.Contract(
    GlobalIncentivesExecutorAbi,
    globalIncentivesExecutorAddress,
  )
  await minterExecutor.methods
    .updateData(tokens, totals, timestamp)
    .send(await formulateTxSenderInfo())
}

async function executeMintOriginal(minterAddress, mintId) {
  let minter = new hre.web3.eth.Contract(DelayMinterAbi, minterAddress)
  await minter.methods.executeMint(mintId).send(await formulateTxSenderInfo())
}

async function setStorageOriginal(minterAddress, newStorage) {
  let minter = new hre.web3.eth.Contract(DelayMinterAbi, minterAddress)
  await minter.methods.setStorage(newStorage).send(await formulateTxSenderInfo())
}

async function executeFirstMint(minterAddress, machineAmountFarm, timestamp) {
  let minter = new hre.web3.eth.Contract(MinterHelperAbi, minterAddress)
  await minter.methods
    .executeFirstMint(machineAmountFarm, timestamp, true, 0)
    .send(await formulateTxSenderInfo())
}

async function notifyIFarmBuybackAmount(
  feeRewardForwarderAddr,
  farmAddr,
  rewardPoolAddr,
  machineAmountFarm,
) {
  let feeRewardForwarder = new hre.web3.eth.Contract(FeeRewardForwarderAbi, feeRewardForwarderAddr)
  await feeRewardForwarder.methods
    .notifyIFarmBuybackAmount(farmAddr, rewardPoolAddr, machineAmountFarm)
    .send(await formulateTxSenderInfo())
}

async function getMintInfo(minterAddress, mintId) {
  let minter = new hre.web3.eth.Contract(MinterHelperAbi, minterAddress)
  return await minter.methods.mints(mintId).call()
}

async function viewState(helperAddress, finalObj, keyName, allVaultsJson) {
  const notifyHelper = new hre.web3.eth.Contract(NotifyHelperStatefulAbi, helperAddress)
  let totalPercentage = await notifyHelper.methods.totalPercentage().call()
  return await viewStateWithExactMint(
    helperAddress,
    finalObj,
    keyName,
    allVaultsJson,
    totalPercentage,
    100.0,
  )
}

async function viewStateWithExactMint(helperAddress, finalObj, keyName, allVaultsJson, mint, unit) {
  const notifyHelper = new hre.web3.eth.Contract(NotifyHelperStatefulAbi, helperAddress)
  const regularResult = await notifyHelper.methods.getConfig(mint).call()

  console.log(regularResult)

  let total = 0

  for (let i = 0; i < regularResult[0].length; i++) {
    let key = Object.keys(allVaultsJson).find(
      key => allVaultsJson[key].NewPool === regularResult[0][i],
    )
    if (!key) {
      console.error('Key not found for', regularResult[0][i])
      key = regularResult[0][i] // just using the address instead
    }
    if (!finalObj[key]) {
      finalObj[key] = {}
    }
    total += +regularResult[2][i]
    finalObj[key][keyName] = `${regularResult[2][i] / unit}%`
  }

  console.log('total:', total / 100)
}

async function viewStateRaw(helperAddress) {
  const notifyHelper = new hre.web3.eth.Contract(NotifyHelperStatefulAbi, helperAddress)
  const regularResult = await notifyHelper.methods
    .getConfig(await notifyHelper.methods.totalPercentage().call())
    .call()
  return regularResult
}

async function setPoolBatchEthereumMainnet(
  statefulEmissionHelperAddress,
  pools,
  percentages,
  types,
  vesting,
) {
  let statefulEmissionHelper = new hre.web3.eth.Contract(
    StatefulEmissionHelperAbi,
    statefulEmissionHelperAddress,
  )

  await statefulEmissionHelper.methods
    .setPoolBatch(pools, percentages, types, vesting)
    .send(await formulateTxSenderInfo())
}

async function setPoolBatch(
  globalIncentivesHelperAddress,
  tokens,
  pools,
  percentages,
  types,
  vesting,
) {
  let globalIncentivesHelper = new hre.web3.eth.Contract(
    GlobalIncentivesHelperAbi,
    globalIncentivesHelperAddress,
  )

  await globalIncentivesHelper.methods
    .setPoolBatch(tokens, pools, percentages, types, vesting)
    .send(await formulateTxSenderInfo())
}

async function approve(tokenAddress, consumerAddress, amount) {
  let tokenInstance = new hre.web3.eth.Contract(ERC20Abi, tokenAddress)
  await tokenInstance.methods.approve(consumerAddress, amount).send(await formulateTxSenderInfo())
}

module.exports = {
  formulateTxSenderInfo,
  printStatsParametrized,
  notifyPools,
  updateRewardDistributionAsNeeded,
  toReadable,
  getBalance,
  getMintInfo,
  viewStateRaw,
  approve,
  appendMints,
  executeMint,
  executeFirstMint,
  notifyIFarmBuybackAmount,
  executeMintOriginal,
  setStorageOriginal,
  transferGovernance,
  viewState,
  viewStateWithExactMint,
  setPoolBatch,
  setPoolBatchEthereumMainnet,
  to18,
  execute,
  getCurrentMintId,
  updateTotals,
}
