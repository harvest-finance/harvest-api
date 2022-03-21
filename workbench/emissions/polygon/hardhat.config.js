require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

const secret = require('../../../../dev-keys.json') // note this is outside the current repository folder
const prompt = require('prompt')
const addresses = require('../../../data/mainnet/addresses.json').MATIC

const helperAddresses = {
  GenericEmissionHelper: '0xfe092d36CcDc81019Bc1A7835bF793abABD76f33',
  GlobalIncentivesHelper: '0x1ebCf09b26E7b892A69cc5289534a1B15ac23156',
  GlobalIncentivesExecutor: '0xBdC9bE69f3C9212c3965B55E6ce7360D03Ea99ce',
  NotifyHelperStatefulFarm: '0x5c93b28bf2048D6D882FB67edb56139d4Ed97b0D',
  NotifyHelperStatefulWMatic: '0xc7d49ffede1120af066448c4acd51f35f6fbaa98',
}

/* global task */

const {
  to18,
  updateRewardDistributionAsNeeded,
  printStatsParametrized,
  notifyPools,
  viewState,
  setPoolBatch,
  updateTotals,
  execute,
} = require('../_shared/lib.js')
const parser = require('../_shared/csv-parser.js')

// do not touch this, it needs to match the smart contract enums
let NotificationType = {
  VOID: 0,
  AMPLIFARM: 1,
  FARM: 2,
  TRANSFER: 3,
  PROFIT_SHARE: 4,
  TOKEN: 5,
}

async function updateState(emissionItems) {
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
    if (
      item.address === '0xE1f9A3EE001a2EcC906E8de637DBf20BB2d44633' ||
      item.address === '0x284D7200a0Dabb05ee6De698da10d00df164f61d' ||
      item.address === '0xB25e2C1efDD4b79CD5d63C0F5a45326FA4CA2139'
    ) {
      continue // skipping some pools
    }
    tokens.push(addresses.WMATIC)
    pools.push(item.address)
    percentages.push(item.percentage)
    types.push(NotificationType.TOKEN)
    vesting.push(false)
  }
  console.log(tokens, pools, percentages, types, vesting)
  console.log('Setting state for bot WMATIC and miFARM through Global Incentives Helper')

  await setPoolBatch(
    helperAddresses.GlobalIncentivesHelper,
    tokens,
    pools,
    percentages,
    types,
    vesting,
  )
}

async function printStats() {
  return printStatsParametrized(
    helperAddresses.GlobalIncentivesHelper,
    'MATIC',
    [addresses.miFARM, addresses.WMATIC],
    ['miFARM', 'WMATIC'],
  )
}

task('record', 'Stores percentages of emissions in the contract').setAction(async () => {
  const emissionItems = await parser.convertFrom(`../_data/polygon.csv`, addresses.V2)
  await printStats()

  prompt.message = `Check to update reward distribution? Type "yes" to do so`
  const { toUpdate } = await prompt.get(['toUpdate'])
  if (toUpdate === 'yes') {
    console.log('Updating reward distribution...')
    await updateRewardDistributionAsNeeded(helperAddresses.GenericEmissionHelper, emissionItems)
    console.log('Updated')
  }

  prompt.message = `Proceed with recording numbers? Type "yes" to continue`
  const { ok } = await prompt.get(['ok'])
  if (ok === 'yes') {
    await updateState(emissionItems)
    console.log('Numbers recorded.')
  } else {
    console.log('Canceled.')
  }
})

task('execute', 'Executes emissions with pre-specified amounts').setAction(async () => {
  await printStats()
  await execute(helperAddresses.GlobalIncentivesExecutor)
  console.log('Executed.')
})

task('update-totals', 'Update total amounts').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Total miFARM amount (in human format like "18.23" miFARM)`
  const { amountMiFarm } = await prompt.get(['amountMiFarm'])
  const machineAmountFarm = to18(amountMiFarm)

  prompt.message = `Total WMATIC amount (in human format like "18.23" wMATIC)`
  const { amountWMatic } = await prompt.get(['amountWMatic'])
  const machineAmountWMatic = to18(amountWMatic)

  prompt.message = `miFARM: ${amountMiFarm} [${machineAmountFarm}]\nWMATIC: ${amountWMatic} [${machineAmountWMatic}]`
  await prompt.get(['ok'])

  if (machineAmountWMatic > 0) {
    await updateTotals(
      helperAddresses.GlobalIncentivesExecutor,
      [addresses.miFARM, addresses.WMATIC],
      [machineAmountFarm, machineAmountWMatic],
      0, // always keep as 0, unless want to reset the state completely
    )
    console.log('Totals updated.')
  } else {
    await updateTotals(
      helperAddresses.GlobalIncentivesExecutor,
      [addresses.miFARM],
      [machineAmountFarm],
      0, // always keep as 0, unless want to reset the state completely
    )
    console.log('Totals updated.')
  }
})

task('old-notify', 'Notifies with specified amounts').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Total miFARM amount (in human format like "18.23" miFARM)`
  const { amountMiFarm } = await prompt.get(['amountMiFarm'])
  const machineAmountFarm = to18(amountMiFarm)

  prompt.message = `Total WMATIC amount (in human format like "18.23" wMATIC)`
  const { amountWMatic } = await prompt.get(['amountWMatic'])
  const machineAmountWMatic = to18(amountWMatic)

  prompt.message = `miFARM: ${amountMiFarm} [${machineAmountFarm}]\nWMATIC: ${amountWMatic} [${machineAmountWMatic}]`
  await prompt.get(['ok'])

  if (machineAmountWMatic > 0) {
    await notifyPools(
      helperAddresses.GlobalIncentivesHelper,
      [addresses.miFARM, addresses.WMATIC],
      [machineAmountFarm, machineAmountWMatic],
      '1637694000', // not relevant on polygon, don't bother updating
    ),
      console.log('Notification completed.')
  } else {
    await notifyPools(
      helperAddresses.GlobalIncentivesHelper,
      [addresses.miFARM],
      [machineAmountFarm],
      '1637694000', // not relevant on polygon, don't bother updating
    ),
      console.log('Notification completed.')
  }
})

task('clear-pool', 'Clears a specific pool address (for emergency)').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Pool address to clear percentage (set to 0)`
  const { poolAddress } = await prompt.get(['poolAddress'])

  prompt.message = `Clear pool ${poolAddress}?`
  await prompt.get(['ok'])

  await updateState([{ percentage: '0', address: poolAddress }])
  console.log('Pool percentage clear.')
})

task('view', 'Views the current state recorded in the contract').setAction(async () => {
  await printStats()

  const finalObj = {}
  await viewState(helperAddresses.NotifyHelperStatefulFarm, finalObj, 'farm', addresses.V2)
  await viewState(helperAddresses.NotifyHelperStatefulWMatic, finalObj, 'wmatic', addresses.V2)
  console.log(finalObj)
  console.log('Querying complete.')
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 137,
      accounts: {
        mnemonic: secret.mnemonic,
      },
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${secret.alchemyKey}`,
      },
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${secret.alchemyKey}`,
      chainId: 137,
      accounts: {
        mnemonic: secret.mnemonic,
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
}
