const BigNumber = require('bignumber.js')
const { web3BSC } = require('../../lib/web3')

const pancakeswapContract = require('../../lib/web3/contracts/pancakeswap/contract.json')
const pancakeswapMethods = require('../../lib/web3/contracts/pancakeswap/methods')

const addresses = require('../../lib/data/addresses.json')

const getPrice = async (
  inTokenAddress,
  outTokenAddress = addresses.BSC.bUSD,
  outTokenDecimals = 18,
) => {
  const selectedAddresses = [inTokenAddress, outTokenAddress]

  const pancakeswapInstance = new web3BSC.eth.Contract(
    pancakeswapContract.abi,
    pancakeswapContract.address.mainnet,
  )

  const result = await pancakeswapMethods.getAmountsOut(
    new BigNumber(10).pow(18).toString(),
    selectedAddresses,
    pancakeswapInstance,
  )

  const price = new BigNumber(result[1]).dividedBy(new BigNumber(10).pow(outTokenDecimals))

  return price.toString()
}

module.exports = {
  getPrice,
}
