const BigNumber = require('bignumber.js')
const axios = require('axios')
const { get } = require('lodash')
const { convexAPR } = require('./convex.utils.js')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    const response = await axios.get('https://www.convexfinance.com/api/curve-apys')

    const convexAPY = await convexAPR(poolId)
    const baseAPY = get(response, `data.apys[${poolId}].baseApy`, 0)

    apy = new BigNumber(convexAPY).plus(baseAPY).times(profitSharingFactor)
  } catch (err) {
    console.error('convex API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getApy,
}
