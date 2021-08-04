const BigNumber = require('bignumber.js')
const axios = require('axios')
const { get } = require('lodash')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    const response = await axios.get('https://s.belt.fi/info/all.json')

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
