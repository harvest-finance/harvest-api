const PotPoolAbi = require('./abi/PotPool.json')
const GlobalIncentivesHelperAbi = require('./abi/GlobalIncentivesHelper.json')
const ERC20Abi = require('./abi/ERC20.json')
const NotifyHelperStatefulAbi = require('./abi/NotifyHelperStateful.json')
const settings = require('./settings.json')

const addresses = require('../../../data/mainnet/addresses.json').MATIC
const BigNumber = require('bignumber.js')

/* global hre */

const helperAddresses = {
  GenericEmissionHelper: '0xfe092d36CcDc81019Bc1A7835bF793abABD76f33',
  GlobalIncentivesHelper: '0x1ebCf09b26E7b892A69cc5289534a1B15ac23156',
  NotifyHelperStatefulFarm: '0x5c93b28bf2048D6D882FB67edb56139d4Ed97b0D',
  NotifyHelperStatefulWMatic: '0xc7d49ffede1120af066448c4acd51f35f6fbaa98',
}

function to18(number) {
  return new BigNumber(number).multipliedBy('1000000000000000000').toFixed()
}

function toReadable(amount) {
  return new BigNumber(amount).dividedBy('1000000000000000000').toFixed()
}

// do not touch this, it needs to match the smart contract enums
let NotificationType = {
  VOID: 0,
  AMPLIFARM: 1,
  FARM: 2,
  TRANSFER: 3,
  PROFIT_SHARE: 4,
  TOKEN: 5,
}

async function formulateTxSenderInfo() {
  const accounts = await hre.ethers.getSigners()
  const sender = accounts[0].address
  const nonce = await hre.web3.eth.getTransactionCount(sender)

  const txSenderInfo = { gasPrice: settings.gasPrice, gas: settings.gasLimit, nonce, from: sender }
  return txSenderInfo
}

async function printStats() {
  const accounts = await hre.ethers.getSigners()
  const sender = accounts[0].address
  console.log('sender', sender)
  let farm = new hre.web3.eth.Contract(ERC20Abi, addresses.miFARM)
  let wmatic = new hre.web3.eth.Contract(ERC20Abi, addresses.WMATIC)

  let foodFarmInitialBalance = new BigNumber(await farm.methods.balanceOf(sender).call()).toFixed()
  console.log(
    `Sender FARM balance: ${foodFarmInitialBalance} [${toReadable(foodFarmInitialBalance)}]`,
  )

  let maticBalance = new BigNumber(await hre.web3.eth.getBalance(sender)).toFixed()
  console.log(`Sender MATIC balance: ${maticBalance} [${toReadable(maticBalance)}]`)

  let notifierFarmBalance = new BigNumber(
    await farm.methods.balanceOf(helperAddresses.GlobalIncentivesHelper).call(),
  ).toFixed()
  console.log(`Notifier FARM balance: ${notifierFarmBalance} [${toReadable(notifierFarmBalance)}]`)

  let notifierWMaticBalance = new BigNumber(
    await wmatic.methods.balanceOf(helperAddresses.GlobalIncentivesHelper).call(),
  ).toFixed()
  console.log(
    `Notifier WMATIC balance: ${notifierWMaticBalance} [${toReadable(notifierWMaticBalance)}]`,
  )
}

async function updateState(emissionItems) {
  let globalIncentivesHelper = new hre.web3.eth.Contract(
    GlobalIncentivesHelperAbi,
    helperAddresses.GlobalIncentivesHelper,
  )

  // Handle the emission
  let tokens = []
  let pools = []
  let percentages = []
  let types = []
  let vesting = []
  for (let i = 0; i < emissionItems.length; i++) {
    const item = emissionItems[i]
    tokens.push(addresses.miFARM)
    pools.push(item.address)
    percentages.push(item.percentage)
    types.push(NotificationType.FARM)
    vesting.push(false)
  }
  for (let i = 0; i < emissionItems.length; i++) {
    const item = emissionItems[i]
    tokens.push(addresses.WMATIC)
    pools.push(item.address)
    percentages.push(item.percentage)
    types.push(NotificationType.TOKEN)
    vesting.push(false)
  }
  console.log(tokens, pools, percentages, types, vesting)
  console.log('Setting state for bot WMATIC and miFARM through Global Incentives Helper')
  await globalIncentivesHelper.methods
    .setPoolBatch(tokens, pools, percentages, types, vesting)
    .send(await formulateTxSenderInfo())
  console.log('Done setting state')
}

async function updateRewardDistributionAsNeeded(emissionItems) {
  let notifyHelperRegularAddress = helperAddresses.GenericEmissionHelper
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

async function notifyPools(miFARMAmount, maticAmount) {
  let globalIncentivesHelper = new hre.web3.eth.Contract(
    GlobalIncentivesHelperAbi,
    helperAddresses.GlobalIncentivesHelper,
  )
  let timestamp = '1637694000' // not relevant on polygon, don't bother updating
  await globalIncentivesHelper.methods
    .notifyPools([addresses.miFARM, addresses.WMATIC], [miFARMAmount, maticAmount], timestamp)
    .send(await formulateTxSenderInfo())
}

async function clearPool(poolAddress) {
  let globalIncentivesHelper = new hre.web3.eth.Contract(
    GlobalIncentivesHelperAbi,
    helperAddresses.GlobalIncentivesHelper,
  )
  let tokens = []
  let pools = []
  let percentages = []
  let types = []
  let vesting = []
  tokens.push(addresses.miFARM)
  pools.push(poolAddress)
  percentages.push('0')
  types.push(NotificationType.FARM)
  vesting.push(false)
  tokens.push(addresses.WMATIC)
  pools.push(poolAddress)
  percentages.push('0')
  types.push(NotificationType.TOKEN)
  vesting.push(false)
  console.log(tokens, pools, percentages, types, vesting)
  await globalIncentivesHelper.methods
    .setPoolBatch(tokens, pools, percentages, types, vesting)
    .send(await formulateTxSenderInfo())
}

async function viewState() {
  const notifyHelperFarm = new hre.web3.eth.Contract(
    NotifyHelperStatefulAbi,
    helperAddresses.NotifyHelperStatefulFarm,
  )
  const farmResult = await notifyHelperFarm.methods
    .getConfig(await notifyHelperFarm.methods.totalPercentage().call())
    .call()

  const notifyHelperWMatic = new hre.web3.eth.Contract(
    NotifyHelperStatefulAbi,
    helperAddresses.NotifyHelperStatefulWMatic,
  )
  const wmaticResult = await notifyHelperWMatic.methods
    .getConfig(await notifyHelperWMatic.methods.totalPercentage().call())
    .call()

  const finalObj = {}

  for (let i = 0; i < farmResult[0].length; i++) {
    const key = Object.keys(addresses.V2).find(
      key => addresses.V2[key].NewPool === farmResult[0][i],
    )
    if (!key) {
      console.error('Key not found for', farmResult[0][i])
    }
    if (!finalObj[key]) {
      finalObj[key] = {}
    }
    finalObj[key].farm = `${farmResult[2][i] * 0.01}%`
  }

  for (let i = 0; i < wmaticResult[0].length; i++) {
    const key = Object.keys(addresses.V2).find(
      key => addresses.V2[key].NewPool === wmaticResult[0][i],
    )
    if (!key) {
      console.error('Key not found for', wmaticResult[0][i])
    }
    if (!finalObj[key]) {
      finalObj[key] = {}
    }
    finalObj[key].wmatic = `${wmaticResult[2][i] * 0.01}%`
  }

  console.log(finalObj)
}

module.exports = {
  updateRewardDistributionAsNeeded,
  updateState,
  viewState,
  clearPool,
  notifyPools,
  toReadable,
  to18,
  printStats,
}
