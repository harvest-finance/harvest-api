require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')
const BigNumber = require('bignumber.js')

const secret = require('../../../../dev-keys.json') // note this is outside the current repository folder
const prompt = require('prompt')
const addresses = require('../../../data/mainnet/addresses.json')
const assert = require('assert')
const baseWeekOffset = 70 // item 0 would correspond to week 70

const helperAddresses = {
  StatefulEmissionsHelper: '0x71316a3465e0fbcd08e665D6675caA8F7B1Dd40A', // StatefulEmissionsHelper
  NotifyHelper: '0xE20c31e3d08027F5AfACe84A3A46B7b3B165053c',
  NotifyHelperIFARM: '0x8af7Eb5a93076F6A2316261aC8D42F97aDaab64E',
  MinterHelper: '0x973d0408deE278203c8613178c1732fd60182916',
  MinterExecutor: '0xA8558d9460Bb13e50542359974E67a59DBE3b15e',
  DelayMinter: '0x284D7200a0Dabb05ee6De698da10d00df164f61d',
  Storage_MinterHelperAsGovernance: '0x9933682D7c7c03a4752Ad26fCf07a0Ed32203D62',
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
  viewStateRaw,
  viewStateWithExactMint,
  approve,
  setPoolBatchEthereumMainnet,
  transferGovernance,
  setStorageOriginal,
  executeMintOriginal,
  notifyIFarmBuybackAmount,
  getCurrentMintId,
  execute,
} = require('../_shared/lib.js')
const parser = require('../_shared/csv-parser.js')

const mintsToFollow = [
  {
    // week 76
    amount: to18('932.98'),
    timestamp: '1644346800',
  },
  {
    // week 77
    amount: to18('891.51'),
    timestamp: '1644951600',
  },
  {
    // week 78
    amount: to18('851.87'),
    timestamp: '1645556400',
  },
  {
    // week 79
    amount: to18('814.00'),
    timestamp: '1646161200',
  },
  {
    // week 80
    amount: to18('777.82'),
    timestamp: '1646766000',
  },
  {
    // week 81
    amount: to18('743.24'),
    timestamp: '1647370800',
  },
  {
    //todo
    // week 82
    amount: to18('710.19'),
    timestamp: '1647975600',
  },
  {
    // week 83
    amount: to18('678.62'),
    timestamp: '1648580400',
  },
  {
    // week 84
    amount: to18('648.45'),
    timestamp: '1649185200',
  },
  {
    // week 85
    amount: to18('619.63'),
    timestamp: '1649790000',
  },
  {
    // week 86
    amount: to18('592.08'),
    timestamp: '1650394800',
  },
  {
    // week 87
    amount: to18('565.76'),
    timestamp: '1650999600',
  },
]

async function filterEmissions(emissionItems) {
  let stateArrays = await viewStateRaw(helperAddresses.StatefulEmissionsHelper)
  console.log('stateArrays', stateArrays)

  // remove each pool from emissionItems that is not in state and emissionItems have 0 emission
  const noZeroEmission = emissionItems.filter(
    item => !(item.percentage == 0 && stateArrays[0].indexOf(item.address) === -1),
  )

  // remove each pool from emissionItems that is in state but the value does not differ
  const onlyChanges = noZeroEmission.filter(
    item => item.percentage != stateArrays[2][stateArrays[0].indexOf(item.address)],
  )

  return onlyChanges
}

async function updateState(emissionItems) {
  // Handle the emission
  let pools = []
  let percentages = []
  let types = []
  let vesting = []
  let totalPercent = new BigNumber(0)
  for (let i = 0; i < emissionItems.length; i++) {
    const item = emissionItems[i]
    pools.push(item.address)
    percentages.push(item.percentage)
    totalPercent = totalPercent.plus(item.percentage)
    types.push(item.notificationType)
    vesting.push(item.isVested)
  }
  console.log(pools, percentages, types, vesting)
  console.log(`TOTAL PERCENT: ${totalPercent.dividedBy(100).toFixed(2)}%`)
  console.log('Setting state for Global Incentives Helper')

  prompt.message = `Proceed with recording numbers? Type "yes" to continue`
  const { ok } = await prompt.get(['ok'])
  if (ok === 'yes') {
    await setPoolBatchEthereumMainnet(
      helperAddresses.StatefulEmissionsHelper,
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
    helperAddresses.StatefulEmissionsHelper,
  )
  await printStats()
  const filteredEmissions = await filterEmissions(emissionItems)
  console.log('filteredEmissions', filteredEmissions)
  await updateState(filteredEmissions)

  const finalObj = {}
  await viewState(helperAddresses.StatefulEmissionsHelper, finalObj, 'farm', addresses.V2)
  console.log(finalObj)
})

task('execute', 'Executes the current available mint and notifies all relevant pools')
  .addParam('debug', 'Increases time if debug is true')
  .setAction(async (taskArgs, hre) => {
    if (taskArgs.debug === 'true') {
      await hre.network.provider.send('evm_increaseTime', [3600 * 24])
      await hre.network.provider.send('evm_mine')
    }

    await printStats()

    prompt.start()
    const mintId = await getCurrentMintId(helperAddresses.MinterExecutor)
    prompt.message = `Current mint id in MinterHelper: ${mintId}. Proceed?`
    await prompt.get(['ok'])

    let check = [
      '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4',
      '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C',
      '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
      '0x2E25800957742C52b4d69b65F9C67aBc5ccbffe6',
      '0x6055d7f2E84e334176889f6d8c3F84580cA4F507',
      '0x15d3A64B2d5ab9E152F16593Cdebc4bB165B5B4A',
    ]

    let before = {}
    for (let i = 0; i < check.length; i++) {
      before[check[i]] = {
        FARM: toReadable(await getBalance(addresses.FARM, check[i])),
        iFARM: toReadable(await getBalance(addresses.iFARM, check[i])),
      }
    }

    await execute(helperAddresses.MinterExecutor)

    console.log('Minting and notification completed.')

    let after = {}
    for (let i = 0; i < check.length; i++) {
      after[check[i]] = {
        FARM: toReadable(await getBalance(addresses.FARM, check[i])),
        iFARM: toReadable(await getBalance(addresses.iFARM, check[i])),
      }
    }

    for (let i = 0; i < check.length; i++) {
      console.log('--------- ' + check[i])
      console.log('iFARM before: ' + before[check[i]].iFARM)
      console.log('iFARM after:  ' + after[check[i]].iFARM)
      console.log('FARM  before: ' + before[check[i]].FARM)
      console.log('FARM  after:  ' + after[check[i]].FARM)
      console.log('---------')
    }
  })

task('execute-mint', 'Executes the mint for the given week and notifies all relevant pools')
  .addParam('week', 'The week to mint')
  .addParam('debug', 'Increases time if debug is true')
  .setAction(async (taskArgs, hre) => {
    if (taskArgs.debug === 'true') {
      await hre.network.provider.send('evm_increaseTime', [3600 * 6])
      await hre.network.provider.send('evm_mine')
    }

    await printStats()
    assert(taskArgs.week >= baseWeekOffset, 'wrong week')

    prompt.start()
    const mintInfo = await getMintInfo(helperAddresses.MinterHelper, taskArgs.week - baseWeekOffset)
    console.log(mintInfo)
    prompt.message = `Please see the FARM amount for week ${taskArgs.week} above. Proceed?`
    await prompt.get(['ok'])

    let check = [
      '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4',
      '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C',
      '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
      '0x2E25800957742C52b4d69b65F9C67aBc5ccbffe6',
      '0x6055d7f2E84e334176889f6d8c3F84580cA4F507',
      '0x15d3A64B2d5ab9E152F16593Cdebc4bB165B5B4A',
    ]

    let before = {}
    for (let i = 0; i < check.length; i++) {
      before[check[i]] = {
        FARM: toReadable(await getBalance(addresses.FARM, check[i])),
        iFARM: toReadable(await getBalance(addresses.iFARM, check[i])),
      }
    }

    await executeMint(
      helperAddresses.MinterHelper,
      taskArgs.week - baseWeekOffset,
      true, // announce next week
    )

    console.log('Minting and notification completed.')

    let after = {}
    for (let i = 0; i < check.length; i++) {
      after[check[i]] = {
        FARM: toReadable(await getBalance(addresses.FARM, check[i])),
        iFARM: toReadable(await getBalance(addresses.iFARM, check[i])),
      }
    }

    for (let i = 0; i < check.length; i++) {
      console.log('--------- ' + check[i])
      console.log('iFARM before: ' + before[check[i]].iFARM)
      console.log('iFARM after:  ' + after[check[i]].iFARM)
      console.log('FARM  before: ' + before[check[i]].FARM)
      console.log('FARM  after:  ' + after[check[i]].FARM)
      console.log('---------')
    }
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
    mintsToFollow.map(m => m.timestamp),
    mintsToFollow.map(() => helperAddresses.MinterHelper), // constant
    mintsToFollow.map(m => m.amount),
  )

  console.log('next mint:', await getMintInfo(helperAddresses.MinterHelper, 0))
  console.log('Next mints were added.')

  const timestampWeek69 = '1640113200'
  const machineAmountFarm = await getBalance(
    addresses.FARM,
    '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f',
  )
  const amountFarm = toReadable(machineAmountFarm)
  prompt.message = `Total FARM amount for this first only week is: ${amountFarm}. Proceed?`
  await prompt.get(['ok'])

  await approve(addresses.FARM, helperAddresses.MinterHelper, machineAmountFarm)
  console.log('Approved')

  console.log(
    '--strat reserve before',
    toReadable(await getBalance(addresses.FARM, '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4')),
  )

  console.log(
    '--ptofit share before',
    toReadable(await getBalance(addresses.FARM, '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C')),
  )

  console.log(
    '--a FARM vault before',
    toReadable(await getBalance(addresses.FARM, '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e')),
  )

  console.log(
    '--an FARM (no vesting) vault before',
    toReadable(await getBalance(addresses.FARM, '0x2E25800957742C52b4d69b65F9C67aBc5ccbffe6')),
  )

  console.log(
    '--an iFARM vault before',
    toReadable(await getBalance(addresses.iFARM, '0x6055d7f2E84e334176889f6d8c3F84580cA4F507')),
  )

  await executeFirstMint(helperAddresses.MinterHelper, machineAmountFarm, timestampWeek69)
  console.log('First mint and notification executed in MinterHelper.')

  ///

  console.log(
    '--strat reserve after',
    toReadable(await getBalance(addresses.FARM, '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4')),
  )

  console.log(
    '--ptofit share after',
    toReadable(await getBalance(addresses.FARM, '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C')),
  )

  console.log(
    '--a FARM vault after',
    toReadable(await getBalance(addresses.FARM, '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e')),
  )

  console.log(
    '--a FARM (no vesting) vault after',
    toReadable(await getBalance(addresses.FARM, '0x2E25800957742C52b4d69b65F9C67aBc5ccbffe6')),
  )

  console.log(
    '--an iFARM vault after',
    toReadable(await getBalance(addresses.iFARM, '0x6055d7f2E84e334176889f6d8c3F84580cA4F507')),
  )

  await printStats()
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
      mintsToFollow.map(m => m.timestamp),
      mintsToFollow.map(() => helperAddresses.MinterHelper), // constant
      mintsToFollow.map(m => m.amount),
    )

    console.log('Minting and notification completed.')
  },
)

task('incentivize-ifarm-pool', 'Incentives a specific iFARM pool').setAction(async () => {
  await printStats()

  prompt.start()

  prompt.message = `Which vault (use id from addresses.json)?`
  const { vaultName } = await prompt.get([
    {
      name: 'vaultName',
      default: '',
    },
  ])

  prompt.message = `confirming pool address. Enter the correct one if it is wrong.`
  const { rewardPoolAddr } = await prompt.get([
    {
      name: 'rewardPoolAddr',
      default: addresses.V2[vaultName].NewPool,
    },
  ])

  prompt.message = `How much? (default 3 farm)`

  const { balance } = await prompt.get([
    {
      name: 'balance',
      default: '3' + '0'.repeat(18),
    },
  ])

  await approve(addresses.FARM, addresses.FeeRewardForwarder, balance)
  console.log('Approved.')
  await notifyIFarmBuybackAmount(
    addresses.FeeRewardForwarder,
    addresses.FARM,
    rewardPoolAddr,
    balance,
  )
  console.log('Minting and notification completed.')
})

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

task('view-exact', 'Views the outcome of the state recorded in the contract').setAction(
  async () => {
    await printStats()

    prompt.message = `How much FARM goes to strategies (70% of the mint)?`

    const { mint } = await prompt.get([
      {
        name: 'mint',
        default: '1.00',
      },
    ])
    const formattedMint = new BigNumber(mint).multipliedBy('1' + '0'.repeat(18)).toFixed()

    const finalObj = {}
    let includeCustom = addresses.V2
    includeCustom['_StrategicReserve'] = { NewPool: '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4' }
    includeCustom['_ProfitSharing'] = { NewPool: '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C' }
    includeCustom['_FARM-WETH'] = { NewPool: '0x6555c79a8829b793F332f1535B0eFB1fE4C11958' }
    includeCustom['_GrainBuyBackBot'] = { NewPool: '0xF49440C1F012d041802b25A73e5B0B9166a75c02' }
    includeCustom['_OtherChainsCombined'] = {
      NewPool: '0x71316a3465e0fbcd08e665D6675caA8F7B1Dd40A',
    }
    includeCustom['_FarmStead'] = { NewPool: '0x95D2e18C069175523F56B617F96be7575E381547' }

    await viewStateWithExactMint(
      helperAddresses.StatefulEmissionsHelper,
      finalObj,
      'farm',
      includeCustom,
      formattedMint,
      1.0e18,
    )
    console.log(finalObj)
    console.log('Querying complete.')
  },
)

task('view', 'Views the current state recorded in the contract').setAction(async () => {
  await printStats()

  const finalObj = {}
  let includeCustom = addresses.V2
  includeCustom['_StrategicReserve'] = { NewPool: '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4' }
  includeCustom['_ProfitSharing'] = { NewPool: '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C' }
  includeCustom['_FARM-WETH'] = { NewPool: '0x6555c79a8829b793F332f1535B0eFB1fE4C11958' }
  includeCustom['_GrainBuyBackBot'] = { NewPool: '0xF49440C1F012d041802b25A73e5B0B9166a75c02' }
  includeCustom['_OtherChainsCombined'] = { NewPool: '0x71316a3465e0fbcd08e665D6675caA8F7B1Dd40A' }
  includeCustom['_FarmStead'] = { NewPool: '0x95D2e18C069175523F56B617F96be7575E381547' }

  await viewState(helperAddresses.StatefulEmissionsHelper, finalObj, 'farm', includeCustom)
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
        // blockNumber: 13984900,
      },
    },
    mainnet: {
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
