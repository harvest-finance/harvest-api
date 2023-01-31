const axios = require('axios')
const { get } = require('lodash')
const { getBoostAPY } = require('./balancer-boost.js')

const { APY_VISION_API_URL, APY_VISION_TOKEN } = require('../../../lib/constants')

const getTradingApy = async (address, providerKey, balancerBoost = false, networkId = '1') => {
  let response, apy

  try {
    response = await axios.get(
      `${APY_VISION_API_URL}/pools/${address}?pool_provider_key=${providerKey}&access_token=${APY_VISION_TOKEN}`,
    )
    apy = get(response, 'data[0].fee_apys_1d', 0) // 1 day moving average APY from trading fees
  } catch (err) {
    console.error('APY.vision API error: ', err)
    apy = 0
  }

  if (balancerBoost) {
    const boost = await getBoostAPY(address, networkId)
    apy += boost
  }

  return apy.toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
