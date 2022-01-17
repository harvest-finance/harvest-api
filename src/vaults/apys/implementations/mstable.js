const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { cachedAxios } = require('../../../lib/db/models/cache')
const { MSTABLE_API_URL } = require('../../../lib/constants')

const getApy = async (pair, chain, profitSharingFactor) => {
  let apy

  try {
    const response = await cachedAxios.get(MSTABLE_API_URL)

    const _apy = get(
      get(response, `data.pools`, []).find(pool => pool.chain === chain && pool.pair === pair),
      'apyDetails.rewardsOnlyAverage',
      0,
    )

    apy = new BigNumber(_apy).times(profitSharingFactor)
  } catch (err) {
    console.error('mStable API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getApy,
}
