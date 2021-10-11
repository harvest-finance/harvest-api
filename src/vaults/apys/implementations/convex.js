const BigNumber = require('bignumber.js')
const { convexAPR } = require('./convex.utils.js')

const getApy = async (poolId, profitSharingFactor) => {
  let apy

  try {
    apy = new BigNumber(await convexAPR(poolId)).times(profitSharingFactor)
  } catch (err) {
    console.error('convex API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getApy,
}
