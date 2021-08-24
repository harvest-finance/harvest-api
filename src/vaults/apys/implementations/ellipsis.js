const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { ELLIPSIS_API_URL } = require('../../../lib/constants')
const { cachedAxios } = require('../../../lib/db/models/cache')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    const response = await cachedAxios.get(`${ELLIPSIS_API_URL}/getPoolData`)
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
