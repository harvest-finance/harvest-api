const PotPoolAbi = require('./abi/PotPool.json')
const ERC20Abi = require('./abi/ERC20.json')
const NotifyHelperStatefulAbi = require('./abi/NotifyHelperStateful.json')
const GlobalIncentivesHelperAbi = require('./abi/GlobalIncentivesHelper.json')

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
    if (!(await poolContract.methods.rewardDistribution(notifyHelperRegularAddress))) {
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

async function viewState(helperAddress, finalObj, keyName, allVaultsJson) {
  const notifyHelper = new hre.web3.eth.Contract(NotifyHelperStatefulAbi, helperAddress)
  const regularResult = await notifyHelper.methods
    .getConfig(await notifyHelper.methods.totalPercentage().call())
    .call()

  for (let i = 0; i < regularResult[0].length; i++) {
    const key = Object.keys(allVaultsJson).find(
      key => allVaultsJson[key].NewPool === regularResult[0][i],
    )
    if (!key) {
      console.error('Key not found for', regularResult[0][i])
    }
    if (!finalObj[key]) {
      finalObj[key] = {}
    }
    finalObj[key][keyName] = `${regularResult[2][i] * 0.01}%`
  }
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

module.exports = {
  formulateTxSenderInfo,
  printStatsParametrized,
  notifyPools,
  updateRewardDistributionAsNeeded,
  toReadable,
  viewState,
  setPoolBatch,
  to18,
}
