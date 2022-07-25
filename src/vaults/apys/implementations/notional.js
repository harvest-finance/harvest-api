const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const notionalAbi = require('../../../lib/web3/contracts/notional/contract.json')
const { getNTokenAccount } = require('../../../lib/web3/contracts/notional/methods')
const { getTokenPrice } = require('../../../prices')
const getNTokenPrice = require('../../../prices/implementations/notional.js').getPrice

const notionalProxy = '0x1344A36A1B56144C3Bc62E7757377D288fDE0369'

const getApy = async (currencyId, note, nToken, underlyingToken, reduction) => {
  const notePrice = await getTokenPrice(note)
  const nTokenPrice = await getNTokenPrice(currencyId, nToken, underlyingToken)

  const notionalInstance = new web3.eth.Contract(notionalAbi, notionalProxy)
  const { totalSupply, incentiveAnnualEmissionRate } = await getNTokenAccount(
    nToken,
    notionalInstance,
  )

  const annualNOTEAccumulatedPerNToken = new BigNumber(incentiveAnnualEmissionRate)
    .multipliedBy(new BigNumber(1e8)) // nToken decimal
    .multipliedBy(new BigNumber(1e18)) // accuracy decimal
    .dividedBy(new BigNumber(totalSupply))

  const casted = new BigNumber(annualNOTEAccumulatedPerNToken).dividedBy(1e18) // accuracy decimal

  let apy = casted.times(new BigNumber(notePrice)).dividedBy(new BigNumber(nTokenPrice))

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
