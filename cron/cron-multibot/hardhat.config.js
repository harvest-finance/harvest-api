require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

const secret = require('./dev-keys.json')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    cron_mainnet: {
      url: 'https://mainnet.infura.io/v3/' + secret.infuraKey,
      accounts: {
        mnemonic: secret.mnemonic,
      },
      gas: 7000000,
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
