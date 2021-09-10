const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const getBalancerTokenPrice = require('../../../prices/implementations/balancer-polygon.js').getPrice
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')

const getApy = async (tokenAddress, poolId, weeklyBAL, reduction, extraReward, weeklyExtraAmount) => {
  const {
    methods: { getTotalSupply },
    contract: { abi },
  } = tokenContractData

  const tokenInstance = new web3MATIC.eth.Contract(abi, tokenAddress)
  const totalSupply = new BigNumber(await getTotalSupply(tokenInstance)).dividedBy(
    new BigNumber(10).pow(18),
  )
  const balPrice = await getTokenPrice(tokenAddresses.BAL)
  let extraPrice = 0
  if (extraReward && weeklyExtraAmount) {
    extraPrice = await getTokenPrice(extraReward, CHAIN_TYPES.MATIC)
  }
  const lpPrice = await getBalancerTokenPrice(tokenAddress, poolId)

  const totalSupplyInUSD = totalSupply.multipliedBy(lpPrice)

  let balApy = new BigNumber(weeklyBAL).times(balPrice).times(52).dividedBy(totalSupplyInUSD)
  let extraApy = 0
  if (extraPrice>0 && weeklyExtraAmount>0) {
    extraApy = new BigNumber(weeklyExtraAmount).times(extraPrice).times(52).dividedBy(totalSupplyInUSD)
  }
  let apy = balApy.plus(extraApy)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
