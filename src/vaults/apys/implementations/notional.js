const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const notionalAbi = require('../../../lib/web3/contracts/notional/contract.json')
const { getNTokenGetClaimableIncentives } = require('../../../lib/web3/contracts/notional/methods')
const { getTokenPrice } = require('../../../prices')
const getNTokenPrice = require('../../../prices/implementations/notional.js').getPrice

const notionalProxy = '0x1344A36A1B56144C3Bc62E7757377D288fDE0369'
const blockPerYear = 6400 * 365

const getApy = async (
  vault,
  currencyId,
  note,
  nToken,
  underlyingToken,
  underlyingTokenDecimal,
  reduction,
) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData
  const tokenInstance = new web3.eth.Contract(abi, nToken)
  const nTokenBalance = new BigNumber(await getBalance(tokenInstance))

  const notePrice = await getTokenPrice(note)
  const nTokenPrice = await getNTokenPrice(currencyId, underlyingToken, underlyingTokenDecimal)

  const notionalInstance = new web3.eth.Contract(notionalAbi, notionalProxy)
  const currentBlock = await web3.eth.getBlockNumber()

  const claimableNoteRewards = new BigNumber(
    await getNTokenGetClaimableIncentives(vault, currentBlock + blockPerYear, notionalInstance),
  )
  const noteRewardPerNToken = claimableNoteRewards.dividedBy(nTokenBalance)

  let apy = noteRewardPerNToken
    .times(new BigNumber(nTokenPrice))
    .dividedBy(new BigNumber(notePrice))

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
