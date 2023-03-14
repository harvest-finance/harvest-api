const BigNumber = require('bignumber.js')
const { auraAPR } = require('./aura.utils.js')

const getApy = async (poolName, profitSharingFactor, networkId = '1') => {
  let apy

  try {
    apy = new BigNumber(await auraAPR(poolName, networkId)).times(profitSharingFactor)
  } catch (err) {
    console.error('aura API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.isNaN() ? '0' : apy.toFixed(2, 1)
}

module.exports = {
  getApy,
}
