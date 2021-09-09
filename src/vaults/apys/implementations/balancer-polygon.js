const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const getBalancerTokenPrice = require('../../../prices/implementations/balancer-polygon.js').getPrice
const { getTokenPrice } = require('../../../prices')

const getApy = async (tokenAddress, poolId, weeklyBAL, reduction, extraReward, weeklyExtraAmount) => {
  const {
    methods: { getTotalSupply },
    contract: { abi },
  } = tokenContractData

  const tokenInstance = new web3.eth.Contract(abi, tokenAddress)
  const totalSupply = new BigNumber(await getTotalSupply(tokenInstance)).dividedBy(
    new BigNumber(10).pow(18),
  )
  const balPrice = await getTokenPrice(tokenAddresses.BAL)
  const extraPrice
  if (extraReward && weeklyExtraAmount) {
    extraPrice = await getTokenPrice(extraReward)
  }
  const lpPrice = await getBalancerTokenPrice(tokenAddress, poolId)

  const totalSupplyInUSD = totalSupply.multipliedBy(lpPrice)

  let apy = new BigNumber(weeklyBAL).times(balPrice).plus(weeklyExtraAmount.times(extraPrice)).times(52).dividedBy(totalSupplyInUSD)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
