const axios = require('axios')
const { get } = require('lodash')

const { APY_VISION_API_URL, APY_VISION_TOKEN } = require('../../../lib/constants')

const getTradingApy = async (address, providerKey) => {
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
  return apy.toFixed(2)
}

module.exports = {
  getTradingApy,
}
