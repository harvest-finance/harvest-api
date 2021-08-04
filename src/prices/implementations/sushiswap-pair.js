const BigNumber = require('bignumber.js')
const { web3 } = require('../../lib/web3')

const sushiSwapRouterContract = require('../../lib/web3/contracts/sushiswap-router/contract.json')
const sushiSwapRouterMethods = require('../../lib/web3/contracts/sushiswap-router/methods')

const addresses = require('../../lib/data/addresses.json')
const { getTokenPrice } = require('..')

const getPrice = async (inTokenAddress, outTokenAddress = addresses.USDC, outTokenDecimals = 6) => {
  const selectedAddresses = [inTokenAddress, outTokenAddress]

  const sushiSwapRouterInstance = new web3.eth.Contract(
    sushiSwapRouterContract.abi,
    sushiSwapRouterContract.address.mainnet,
  )

  const result = await sushiSwapRouterMethods.getAmountsOut(
    new BigNumber(10).pow(18).toString(),
    selectedAddresses,
    sushiSwapRouterInstance,
  )

  const price = new BigNumber(result[1]).dividedBy(new BigNumber(10).pow(outTokenDecimals))

  const outTokenPrice = await getTokenPrice(outTokenAddress)

  return new BigNumber(outTokenPrice).times(price).toString()
}

module.exports = {
  getPrice,
}
