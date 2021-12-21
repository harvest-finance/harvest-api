require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')
const BigNumber = require('bignumber.js')

const secret = require('../../../../dev-keys.json') // note this is outside the current repository folder
const prompt = require('prompt')
const addresses = require('../../../data/mainnet/addresses.json')
const assert = require('assert')
const baseWeekOffset = 70 // item 0 would correspond to week 70

const helperAddresses = {
  StatefulEmissionsHelper: '0xbf025cA78DC18e8646B706A49dC194D04537A14D', // StatefulEmissionsHelper
  NotifyHelper: '0xE20c31e3d08027F5AfACe84A3A46B7b3B165053c',
  NotifyHelperIFARM: '0x8af7Eb5a93076F6A2316261aC8D42F97aDaab64E',
  MinterHelper: '0xE5C6BE56401986F8ae7e031bFAD5e07c13467fD4',
  DelayMinter: '0x284D7200a0Dabb05ee6De698da10d00df164f61d',
  Storage_MinterHelperAsGovernance: '0x8085407A8b5Cc475Cc5c02F872b39b57E4Ee3bCF',
}

/* global task */

const {
  toReadable,
  to18,
  printStatsParametrized,
  executeMint,
  executeFirstMint,
  getMintInfo,
  appendMints,
  getBalance,
  viewState,
  setPoolBatch,
  transferGovernance,
  setStorageOriginal,
  executeMintOriginal,
} = require('../_shared/lib.js')
const parser = require('../_shared/csv-parser.js')

const mintsToFollow = [
  {
    // week 70
    amount: to18('1225.66'),
    timestamp: '1640718000',
  },
  {
    // week 71
    amount: to18('1171.17'),
    timestamp: '1641322800',
  },
  {
    // week 72
    amount: to18('1119.11'),
    timestamp: '1641927600',
  },
  {
    // week 73
    amount: to18('1069.36'),
    timestamp: '1642532400',
  },
  {
    // week 74
    amount: to18('1021.82'),
    timestamp: '1643137200',
  },
  {
    // week 75
    amount: to18('976.39'),
    timestamp: '1643742000',
  },
]

async function updateState(emissionItems) {
  // Handle the emission
  let tokens = []
  let pools = []
  let percentages = []
  let types = []
  let vesting = []
  let totalPercent = new BigNumber(0)
  for (let i = 0; i < emissionItems.length; i++) {
    const item = emissionItems[i]
    tokens.push(addresses.FARM)
    pools.push(item.address)
    percentages.push(item.percentage)
    totalPercent = totalPercent.plus(item.percentage)
    types.push(item.notificationType)
    vesting.push(item.isVested)
  }
  console.log(tokens, pools, percentages, types, vesting)
  console.log(`TOTAL PERCENT: ${totalPercent.dividedBy(100).toFixed(2)}%`)
  console.log('Setting state for Global Incentives Helper')

  prompt.message = `Proceed with recording numbers? Type "yes" to continue`
  const { ok } = await prompt.get(['ok'])
  if (ok === 'yes') {
    await setPoolBatch(
      helperAddresses.StatefulEmissionsHelper,
      tokens,
      pools,
      percentages,
      types,
      vesting,
    )
    console.log('Numbers recorded.')
  } else {
    console.log('Canceled.')
  }
}

async function printStats() {
  return printStatsParametrized(
    helperAddresses.StatefulEmissionsHelper,
    'Ether',
    [addresses.FARM],
    ['FARM'],
  )
}

task('record', 'Stores percentages of emissions in the contract').setAction(async () => {
  const emissionItems = await parser.convertFromForEthereumMainnet(
    `../_data/ethereum.csv`,
    addresses.V2,
  )
  await printStats()
  await updateState(emissionItems)

  const finalObj = {}
  await viewState(helperAddresses.StatefulEmissionsHelper, finalObj, 'farm', addresses.V2)
  console.log(finalObj)
})

task(
  'execute-mint',
  'Executes the mint for the given week and notifies all relevant pools',
).setAction(async taskArgs => {
  await printStats()
  assert(taskArgs.week >= baseWeekOffset, 'wrong week')

  prompt.start()
  const mintInfo = await getMintInfo(helperAddresses.MinterHelper, taskArgs.week - baseWeekOffset)
  console.log(mintInfo)
  prompt.message = `Please see the FARM amount for week ${taskArgs.week} above. Proceed?`
  await prompt.get(['ok'])

  await executeMint(
    helperAddresses.MinterHelper,
    taskArgs.week - baseWeekOffset,
    true, // announce next week
  )

  console.log('Minting and notification completed.')
})

task(
  'execute-first-mint',
  'Executes the very first mint and notifies all relevant pools',
).setAction(async () => {
  await printStats()

  prompt.start()

  prompt.message = `Proceed with governance switch of DelayMinter back to f00d?`
  await prompt.get(['ok'])

  await transferGovernance(
    helperAddresses.MinterHelper,
    helperAddresses.DelayMinter,
    '0xc95CbE4ca30055c787CB784BE99D6a8494d0d197',
  )
  console.log('Governance transfered.')

  prompt.message = `Proceed with executeMint on original DelayMinter?`
  await prompt.get(['ok'])

  await executeMintOriginal(helperAddresses.DelayMinter, 69 - 2)
  console.log('First mint executed in DelayMinter.')

  prompt.message = `Proceed with governance switch of DelayMinter to MinterHelper?`
  await prompt.get(['ok'])

  await setStorageOriginal(
    helperAddresses.DelayMinter,
    helperAddresses.Storage_MinterHelperAsGovernance,
  )
  console.log('Governance of DelayMinter transfered back to MinterHelper.')

  console.log(mintsToFollow)
  prompt.message = `Append initial mints?`
  await prompt.get(['ok'])

  await appendMints(
    helperAddresses.MinterHelper,
    mintsToFollow.map(m => m.amount),
    mintsToFollow.map(() => helperAddresses.MinterHelper), // constant
    mintsToFollow.map(m => m.timestamp),
  )

  console.log('Next mints were added.')

  const timestampWeek69 = '1640113200'
  const machineAmountFarm = await getBalance(
    addresses.FARM,
    '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f',
  )
  const amountFarm = toReadable(machineAmountFarm)
  prompt.message = `Total FARM amount for this first only week is: ${amountFarm}. Proceed?`
  await prompt.get(['ok'])

  await executeFirstMint(helperAddresses.MinterHelper, machineAmountFarm, timestampWeek69)
  console.log('First mint and notification executed in MinterHelper.')
})

task('append-mints', 'Executes the very first mint and notifies all relevant pools').setAction(
  async () => {
    await printStats()

    prompt.start()

    console.log(mintsToFollow)
    prompt.message = `Append the mints?`
    await prompt.get(['ok'])

    await appendMints(
      helperAddresses.MinterHelper,
      mintsToFollow.map(m => m.amount),
      mintsToFollow.map(() => helperAddresses.MinterHelper), // constant
      mintsToFollow.map(m => m.timestamp),
    )

    console.log('Minting and notification completed.')
  },
)

task('clear-pool', 'Clears a specific pool address (for emergency)').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Pool address to clear percentage (set to 0)`
  const { poolAddress } = await prompt.get(['poolAddress'])

  prompt.message = `Clear pool ${poolAddress}?`
  await prompt.get(['ok'])

  await updateState([{ percentage: '0', address: poolAddress }])
  console.log('Pool percentage cleared.')
})

task('view', 'Views the current state recorded in the contract').setAction(async () => {
  await printStats()

  const finalObj = {}
  await viewState(helperAddresses.StatefulEmissionsHelper, finalObj, 'farm', addresses.V2)
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
      accounts: {
        mnemonic: secret.mnemonic,
      },
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/' + secret.alchemyKey,
      },
    },
    cron_mainnet: {
      url: 'https://eth-mainnet.alchemyapi.io/v2/' + secret.alchemyKey,
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
