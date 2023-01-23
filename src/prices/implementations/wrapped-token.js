const BigNumber = require('bignumber.js')
const { getTokenPrice } = require('../')
const { getWeb3 } = require('../../lib/web3')
const { token: tokenContractData } = require('../../lib/web3/contracts')
const { CHAIN_TYPES } = require('../../lib/constants')

const getPrice = async (wrapper, underlying, chain = CHAIN_TYPES.ETH) => {
  const {
    contract: { abi: tokenAbi },
    methods: { getTotalSupply, getBalance, getDecimals },
  } = tokenContractData

  const web3Instance = getWeb3(chain)
  const wrapperInstance = await new web3Instance.eth.Contract(tokenAbi, wrapper)
  const underlyingInstance = await new web3Instance.eth.Contract(tokenAbi, underlying)

  const wrapperDecimals = await getDecimals(wrapperInstance)
  const underlyingDecimals = await getDecimals(underlyingInstance)

  const wrapperBalance = new BigNumber(await getBalance(wrapper, underlyingInstance)).div(
    10 ** underlyingDecimals,
  )
  const wrapperTotalSupply = new BigNumber(await getTotalSupply(wrapperInstance)).div(
    10 ** wrapperDecimals,
  )

  const underlyingTokenPrice = new BigNumber(await getTokenPrice(underlying, chain))

  const wrapperPrice = wrapperBalance
    .multipliedBy(underlyingTokenPrice)
    .dividedBy(wrapperTotalSupply)

  return wrapperPrice.toString(10)
}

module.exports = {
  getPrice,
}
