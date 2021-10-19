const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { cachedAxios } = require('../../../lib/db/models/cache')
const { BELT_API_URL } = require('../../../lib/constants')

const getTradingApy = async poolId => {
  let apy

  try {
    const response = await cachedAxios.get(BELT_API_URL)

    const beltApy = get(
      get(response, `data.info.BSC.vaultPools`, []).find(pool => pool.pid === poolId),
      'baseAPR',
      0,
    )

    apy = new BigNumber(beltApy)
  } catch (err) {
    console.error('belt API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
