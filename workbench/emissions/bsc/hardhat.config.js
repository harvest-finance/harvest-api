require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

const secret = require('../../../../dev-keys.json') // note this is outside the current repository folder
const prompt = require('prompt')
const addresses = require('../../../data/mainnet/addresses.json').BSC

const helperAddresses = {
  GenericEmissionHelper: '0xf328f799A9C719F446E05385EB64c8a29D3B0674',
  StatefulEmissionHelperFARM: '0xDe7099898619E6264B4a3b702A9c69bf1f2eCA1C',
  GlobalIncentivesHelper: '0x19b3ABA7BA46f9Cac08BA2872cbCf8F96aE8DE15',
  GlobalIncentivesExecutor: '0x0ACBD1f071290e94ED175dd59fE3df5e766d6F7B',
  NotifyHelperAmpliFARM: '0xd9B13B448Ae9d93DC7b9FBc7FACc83E9B1f4C9DC',
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
    tokens.push(addresses.bFARM)
    pools.push(item.address)
    percentages.push(item.percentage)
    types.push(NotificationType.AMPLIFARM)
    vesting.push(false)
  }
  console.log(tokens, pools, percentages, types, vesting)
  console.log('Setting state for ampliFARM Global Incentives Helper')

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
    'BNB',
    [addresses.bFARM],
    ['bFARM'],
  )
}

task('record', 'Stores percentages of emissions in the contract').setAction(async () => {
  const emissionItems = await parser.convertFrom(`../_data/bsc.csv`, addresses.V2)
  await printStats()

  prompt.message = `Check to update reward distribution? Type "yes" to do so`
  const { toUpdate } = await prompt.get(['toUpdate'])
  if (toUpdate === 'yes') {
    console.log('Updating reward distribution...')
    await updateRewardDistributionAsNeeded(helperAddresses.NotifyHelperAmpliFARM, emissionItems)
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

task('update-totals', 'Record the updated totals').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Total bFARM amount (in human format like "18.23" bFARM)`
  const { amountBFarm } = await prompt.get(['amountBFarm'])
  const machineBFarm = to18(amountBFarm)

  prompt.message = `bFARM: ${amountBFarm} [${machineBFarm}]`
  await prompt.get(['ok'])

  await updateTotals(
    helperAddresses.GlobalIncentivesExecutor,
    [addresses.bFARM],
    [machineBFarm],
    0, // ALWAYS keep as 0 (unless want to reset the state)
  )

  console.log('Totals updated.')
})

task('execute', 'Executes emissions with pre-specified amounts').setAction(async () => {
  await printStats()
  await execute(helperAddresses.GlobalIncentivesExecutor)
  console.log('Executed.')
})

task('old-notify', 'Notifies with specified amounts').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Total bFARM amount (in human format like "18.23" bFARM)`
  const { amountBFarm } = await prompt.get(['amountBFarm'])
  const machineBFarm = to18(amountBFarm)

  prompt.message = `bFARM: ${amountBFarm} [${machineBFarm}]`
  await prompt.get(['ok'])

  await notifyPools(
    helperAddresses.GlobalIncentivesHelper,
    [addresses.bFARM],
    [machineBFarm],
    '1637694000', // not relevant on BSC, don't bother updating
  ),
    console.log('Notification completed.')
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
  await viewState(helperAddresses.StatefulEmissionHelperFARM, finalObj, 'bFarm', addresses.V2)
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
      chainId: 56,
      accounts: {
        mnemonic: secret.mnemonic,
      },
      forking: {
        url: 'https://bsc.getblock.io/mainnet/?api_key=' + secret.getBlockKey,
      },
    },
    mainnet: {
      url: 'https://bsc.getblock.io/mainnet/?api_key=' + secret.getBlockKey,
      chainId: 56,
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
