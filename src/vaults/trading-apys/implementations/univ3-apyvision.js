const axios = require('axios')
const { get } = require('lodash')
const { web3 } = require('../../../lib/web3')
const { getPosId } = require('../../../prices/implementations/uniswap-v3')
const { getDailyCompound } = require('../../../lib/utils.js')
const BigNumber = require('bignumber.js')

const { APY_VISION_API_URL, APY_VISION_TOKEN } = require('../../../lib/constants')

const getTradingApy = async (vaultAddress, providerKey, reduction) => {
  let response, data, apr, apy, isWeekOld

  const posId = await getPosId(vaultAddress, web3)

  try {
    response = await axios.get(
      `${APY_VISION_API_URL}/uniswapv3/${providerKey}/positions/${posId}?access_token=${APY_VISION_TOKEN}`,
    )
    data = get(response, 'data', 0)
    isWeekOld = Number(data.position_age_days) >= 7
    if (isWeekOld) {
      apr = new BigNumber(data.day_datas[0].fee_apys.apy_7d).times(reduction) // 7 day moving average APY from trading fees
    } else {
      apr = new BigNumber(data.day_datas[0].fee_apys.apy_inception).times(reduction) // moving average APY from trading fees since inception
    }
    apy = getDailyCompound(apr)
  } catch (err) {
    console.error('APY.vision API error: ', err)
    apy = 0
  }
  return apy
}

module.exports = {
  getTradingApy,
}
