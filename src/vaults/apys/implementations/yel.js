const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const yelMasterContract = require('../../../lib/web3/contracts/yel-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoYel,
  getTotalAllocPoint: getTotalAllocPointYel,
  getYelPerSecond,
} = require('../../../lib/web3/contracts/yel-masterchef/methods')

const { getTokenPrice } = require('../../../prices')

const getYelPoolWeight = async (poolInfo, yelInstance) => {
  const totalAllocPoint = await getTotalAllocPointYel(yelInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, reduction, hodlPoolId, hodlReduction) => {
  if (!hodlPoolId) {
    return await getPoolApy(poolId, reduction)
  } else {
    let baseApr = await getPoolApy(poolId, reduction)
    let hodlApr = await getPoolApy(hodlPoolId, hodlReduction)
    let hodlApy = ((hodlApr / 100 / 365 + 1) ** 365 - 1) * 100
    return (baseApr * hodlApy) / 2 / (hodlApr / 2)
  }
}

const getPoolApy = async (poolId, reduction) => {
  const masterChefContract = yelMasterContract

  const yelInstance = new web3.eth.Contract(
    masterChefContract.abi,
    masterChefContract.address.mainnet,
  )

  let yelPerSecond = new BigNumber(await getYelPerSecond(yelInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  let secondsPerYear = 31536000
  let poolInfo = await getPoolInfoYel(poolId, yelInstance)

  const totalSupply = new BigNumber(poolInfo.stakingTokenTotalAmount).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  const poolWeight = await getYelPoolWeight(poolInfo, yelInstance)
  const yelPriceInUsd = await getTokenPrice(tokenAddresses.YEL)
  const lpTokenPrice = await getTokenPrice(poolInfo.stakingToken)
  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(yelPriceInUsd).times(yelPerSecond).times(secondsPerYear)

  apy = apy.times(poolWeight).div(totalSupplyInUsd)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
