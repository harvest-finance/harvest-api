require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

const secret = require('./dev-keys.json')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 56,
      forking: {
        url: 'https://bsc-dataseed.binance.org'
      },
    },
    cron_mainnet: {
      url: 'https://bsc-dataseed.binance.org',
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
