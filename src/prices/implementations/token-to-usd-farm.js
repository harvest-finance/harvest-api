const BigNumber = require('bignumber.js')
const { web3 } = require('../../lib/web3')

const uniswapContract = require('../../lib/web3/contracts/uniswap/contract.json')
const uniswapMethods = require('../../lib/web3/contracts/uniswap/methods')

const addresses = require('../../lib/data/addresses.json')

const getPrice = async tokenAddress => {
  const uniswapInstance = new web3.eth.Contract(
    uniswapContract.abi,
    uniswapContract.address.mainnet,
  )

  const tokenPrice = await uniswapMethods.getAmountsOut(
    new BigNumber(10).exponentiatedBy(18).toString(),
    [tokenAddress, addresses.FARM],
    uniswapInstance,
  )

  const farmPrice = await uniswapMethods.getAmountsOut(
    new BigNumber(10).exponentiatedBy(18).toString(),
    [addresses.FARM, addresses.USDC],
    uniswapInstance,
  )

  const totalInUsd = new BigNumber(tokenPrice[1])
    .multipliedBy(new BigNumber(farmPrice[1]))
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  return totalInUsd.dividedBy(new BigNumber(10).exponentiatedBy(6)).toFixed(4)
}

module.exports = {
  getPrice,
}
