const BigNumber = require('bignumber.js')
const { web3 } = require('../../lib/web3')
const notionalContractAbi = require('../../lib/web3/contracts/notional/contract.json')
const {
  getNTokenPresentValueUnderlyingDenominated,
} = require('../../lib/web3/contracts/notional/methods')
const { getTokenPrice } = require('../index')
const { token: tokenContractData } = require('../../lib/web3/contracts')

const notionalProxy = '0x1344A36A1B56144C3Bc62E7757377D288fDE0369'

const getPrice = async (currencyId, nToken, underlyingToken) => {
  const underlyingPrice = await getTokenPrice(underlyingToken)
  const {
    methods: { getTotalSupply },
    contract: { abi: tokenAbi },
  } = tokenContractData
  const tokenInstance = new web3.eth.Contract(tokenAbi, nToken)

  const totalSupply = new BigNumber(await getTotalSupply(tokenInstance))

  const instance = new web3.eth.Contract(notionalContractAbi, notionalProxy)
  const nTokenValueInUnderlying = new BigNumber(
    await getNTokenPresentValueUnderlyingDenominated(currencyId, instance),
  )

  const casted = nTokenValueInUnderlying.dividedBy(totalSupply)

  return casted.multipliedBy(new BigNumber(underlyingPrice))
}

module.exports = {
  getPrice,
}
