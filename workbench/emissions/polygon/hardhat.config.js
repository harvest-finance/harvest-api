require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

const secret = require('../../../../dev-keys.json')
const prompt = require('prompt')
const parser = require('../shared/csv-parser.js')
const assert = require('assert')
const addresses = require('../../../data/mainnet/addresses.json').MATIC

/* global task */

const {
  updateRewardDistributionAsNeeded,
  updateState,
  notifyPools,
  printStats,
  viewState,
  clearPool,
  to18,
} = require('./lib.js')

task('record', 'Stores percentages of emissions in the contract')
  .addParam('week', 'The release week number')
  .setAction(async taskArgs => {
    const emissionItems = await parser.convertFrom(
      require('csv-parse'),
      `../polygon/weeks/week-${taskArgs.week}.csv`,
      addresses.V2,
    )
    await printStats()

    prompt.message = `Check to update reward distribution? Type "yes" to do so`
    const { toUpdate } = await prompt.get(['toUpdate'])
    if (toUpdate === 'yes') {
      console.log('Updating reward distribution...')
      await updateRewardDistributionAsNeeded(emissionItems)
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

task('notify', 'Notifies with specified amounts')
  .addParam('week', 'The release week number')
  .setAction(async taskArgs => {
    await printStats()
    assert(taskArgs.week)

    prompt.start()
    prompt.message = `Total miFARM amount (in human format like "18.23" miFARM) for ${taskArgs.week}`
    const { amountMiFarm } = await prompt.get(['amountMiFarm'])
    const machineAmountFarm = to18(amountMiFarm)

    prompt.message = `Total WMATIC amount (in human format like "18.23" wMATIC) for ${taskArgs.week}`
    const { amountWMatic } = await prompt.get(['amountWMatic'])
    const machineAmountWMatic = to18(amountWMatic)

    prompt.message = `miFARM: ${amountMiFarm} [${machineAmountFarm}]\nWMATIC: ${amountWMatic} [${machineAmountWMatic}]`
    await prompt.get(['ok'])

    await notifyPools(amountMiFarm, amountWMatic)
    console.log('Notification completed.')
  })

task('clear-pool', 'Clears a specific pool address (for emergency)').setAction(async () => {
  await printStats()

  prompt.start()
  prompt.message = `Pool address to clear percentage (set to 0)`
  const { poolAddress } = await prompt.get(['poolAddress'])

  prompt.message = `Clear pool ${poolAddress}?`
  await prompt.get(['ok'])

  await clearPool(poolAddress)
  console.log('Pool percentage clear.')
})

task('view', 'Views the current state recorded in the contract').setAction(async () => {
  await printStats()

  await viewState()
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
