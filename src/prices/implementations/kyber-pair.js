const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../lib/web3')

const kyberPairContract = require('../../lib/web3/contracts/kyber-pair/contract.json')
const kyberPairMethods = require('../../lib/web3/contracts/kyber-pair/methods')
const { token: tokenContractData } = require('../../lib/web3/contracts')

const { getTokenPrice } = require('..')

const getPrice = async (inTokenAddress, outTokenAddress, pairAddress) => {
  const { methods: tokenMethods, contract: tokenContract } = tokenContractData
  const kyberPairInstance = new web3MATIC.eth.Contract(kyberPairContract.abi, pairAddress)

  const result = await kyberPairMethods.getTradeInfo(kyberPairInstance)
  const token0 = await kyberPairMethods.getToken0(kyberPairInstance)
  const token1 = await kyberPairMethods.getToken1(kyberPairInstance)
  const token0Instance = new web3MATIC.eth.Contract(tokenContract.abi, token0)
  const token1Instance = new web3MATIC.eth.Contract(tokenContract.abi, token1)
  const token0Decimals = await tokenMethods.getDecimals(token0Instance)
  const token1Decimals = await tokenMethods.getDecimals(token1Instance)

  let price
  if (inTokenAddress == token0) {
    price = new BigNumber(result._vReserve1)
      .div(result._vReserve0)
      .times(new BigNumber(10).pow(token0Decimals))
      .div(new BigNumber(10).pow(token1Decimals))
  } else {
    price = new BigNumber(result._vReserve0)
      .div(result._vReserve1)
      .times(new BigNumber(10).pow(token1Decimals))
      .div(new BigNumber(10).pow(token0Decimals))
  }

  const outTokenPrice = await getTokenPrice(outTokenAddress)

  price = price.times(outTokenPrice)

  return price.toString()
}

module.exports = {
  getPrice,
}
