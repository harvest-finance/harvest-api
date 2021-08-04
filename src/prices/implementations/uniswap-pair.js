const BigNumber = require('bignumber.js')
const { web3 } = require('../../lib/web3')

const uniswapContract = require('../../lib/web3/contracts/uniswap/contract.json')
const uniswapMethods = require('../../lib/web3/contracts/uniswap/methods')

const addresses = require('../../lib/data/addresses.json')

const getPrice = async (inTokenAddress, outTokenAddress = addresses.USDC, outTokenDecimals = 6) => {
  const selectedAddresses = [inTokenAddress, outTokenAddress]
  const isOutTokenWETH = outTokenAddress === addresses.WETH

  if (isOutTokenWETH) {
    selectedAddresses.push(addresses.USDC)
  }

  const uniswapInstance = new web3.eth.Contract(
    uniswapContract.abi,
    uniswapContract.address.mainnet,
  )

  const result = await uniswapMethods.getAmountsOut(
    new BigNumber(10).pow(18).toString(),
    selectedAddresses,
    uniswapInstance,
  )

  const price = new BigNumber(result[isOutTokenWETH ? 2 : 1]).dividedBy(
    new BigNumber(10).pow(outTokenDecimals),
  )

  return price.toString()
}

module.exports = {
  getPrice,
}
