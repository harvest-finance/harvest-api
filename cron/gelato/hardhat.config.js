require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-web3');
require("@nomiclabs/hardhat-truffle5");

const secret = require('./dev-keys.json');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 137,
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${secret.alchemyKey}`,
        blockNumber: 23880727
      },
      // gasPrice: 30000000000
    },
    cron_mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${secret.alchemyKey}`,
      chainId: 137,
      // accounts: {
      //   mnemonic: secret.mnemonic,
      // },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 2000000,
  },
}
