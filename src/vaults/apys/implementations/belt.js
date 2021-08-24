const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { cachedAxios } = require('../../../lib/db/models/cache')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    const response = await cachedAxios.get('https://s.belt.fi/info/all.json')

    const beltApy = get(
      get(response, `data.info.BSC.vaultPools`, []).find(pool => pool.pid === poolId),
      'rewardAPR',
      0,
    )

    apy = new BigNumber(beltApy).times(profitSharingFactor)
  } catch (err) {
    console.error('belt API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getApy,
}
