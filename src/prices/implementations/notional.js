const BigNumber = require('bignumber.js')
const { web3 } = require('../../lib/web3')
const notionalContractAbi = require('../../lib/web3/contracts/notional/contract.json')
const {
  getNTokenPresentValueUnderlyingDenominated,
} = require('../../lib/web3/contracts/notional/methods')
const { getTokenPrice } = require('../index')

const notionalProxy = '0x1344A36A1B56144C3Bc62E7757377D288fDE0369'
const nTokenValueDecimal = 8

const getPrice = async (currencyId, underlyingToken, underlyingDecimal) => {
  const underlyingPrice = await getTokenPrice(underlyingToken)

  const instance = new web3.eth.Contract(notionalContractAbi, notionalProxy)
  const nTokenValueInUnderlying = new BigNumber(
    await getNTokenPresentValueUnderlyingDenominated(currencyId, instance),
  )

  let casted
  if (underlyingDecimal >= nTokenValueDecimal) {
    casted = nTokenValueInUnderlying.multipliedBy(
      new BigNumber(10).pow(underlyingDecimal - nTokenValueDecimal),
    )
  } else {
    casted = nTokenValueInUnderlying.dividedBy(
      new BigNumber(10).pow(nTokenValueDecimal - underlyingDecimal),
    )
  }

  return casted.multipliedBy(new BigNumber(underlyingPrice))
}

module.exports = {
  getPrice,
}
