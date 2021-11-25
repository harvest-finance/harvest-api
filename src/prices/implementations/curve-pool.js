const BigNumber = require('bignumber.js')
const { forEach } = require('promised-loops')

const { getWeb3 } = require('../../lib/web3')
const { getUIData } = require('../../lib/data')

const { token: tokenContractData } = require('../../lib/web3/contracts')

const { UI_DATA_FILES } = require('../../lib/constants')
const { getTokenPrice } = require('..')

const getPrice = async (minerAddress, crvTokenAddress, crvTokenDecimals, assets, network = '1') => {
  const web3 = getWeb3(network)
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const { methods: tokenMethods, contract: tokenContract } = tokenContractData
  let poolValueUSD = new BigNumber(0)

  await forEach(assets, async asset => {
    const assetInstance = new web3.eth.Contract(tokenContract.abi, tokens[asset].tokenAddress)

    const assetPoolBalance = new BigNumber(
      await tokenMethods.getBalance(minerAddress, assetInstance),
    ).dividedBy(new BigNumber(10).pow(tokens[asset].decimals))
    const assetPriceUSD = await getTokenPrice(tokens[asset].tokenAddress, network)

    poolValueUSD = poolValueUSD.plus(assetPoolBalance.times(assetPriceUSD))
  })

  const crvTokenInstance = new web3.eth.Contract(tokenContract.abi, crvTokenAddress)

  const poolTokenSupply = new BigNumber(
    await tokenMethods.getTotalSupply(crvTokenInstance),
  ).dividedBy(new BigNumber(10).pow(crvTokenDecimals))
  return poolValueUSD.dividedBy(poolTokenSupply).toFixed()
}

module.exports = {
  getPrice,
}
