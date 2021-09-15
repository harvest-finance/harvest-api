const BigNumber = require('bignumber.js')
const { getPoolSnapshot, getPoolInfo } = require('../../../lib/third-party/balancer')
const { get } = require('lodash')

const getTradingApy = async (poolId, networkId) => {
  const DAY = 60 * 60 * 24
  const currentTimestamp = Math.ceil(Date.now() / 1000)
  const todayTimestamp = currentTimestamp - (currentTimestamp % DAY) - DAY
  const yesterdayTimestamp = todayTimestamp - DAY

  const todaySnapshot = await getPoolSnapshot(poolId, todayTimestamp, networkId)
  const yesterdaySnapshot = await getPoolSnapshot(poolId, yesterdayTimestamp, networkId)

  const poolInfo = await getPoolInfo(poolId, networkId)

  if (
    !get(poolInfo, 'totalLiquidity') ||
    !get(todaySnapshot, 'swapFees') ||
    !get(yesterdaySnapshot, 'swapFees')
  ) {
    console.error('Something went wrong with balancer api. Swap apy not available')
    return '0'
  }

  let apy = new BigNumber(todaySnapshot.swapFees)
    .minus(yesterdaySnapshot.swapFees)
    .times(365)
    .dividedBy(poolInfo.totalLiquidity)

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
