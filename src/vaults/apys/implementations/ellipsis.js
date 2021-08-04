const BigNumber = require('bignumber.js')
const ellipsisApi = require('../../../lib/third-party/ellipsis')
const { get } = require('lodash')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    const response = await ellipsisApi.get('getPoolData')
    const poolApy = get(response, `data.data.pools[${poolId}].apy`, 0)

    apy = new BigNumber(poolApy).div(100).dividedBy(2).times(profitSharingFactor)
  } catch (err) {
    console.error('ellipsis API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.times(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
