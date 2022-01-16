const axios = require('axios')
const { get } = require('lodash')
const { web3 } = require('../../../lib/web3')
const { getPosId } = require('../../../prices/implementations/uniswap-v3')
const { getDailyCompound } = require('../../../lib/utils.js')
const BigNumber = require('bignumber.js')

const { APY_VISION_API_URL } = require('../../../lib/constants')

const getTradingApy = async (vaultAddress, providerKey, reduction) => {
  let response, data, apr, apy

  const posId = await getPosId(vaultAddress, web3)

  try {
    response = await axios.get(`${APY_VISION_API_URL}/uniswapv3/${providerKey}/positions/${posId}`)
    data = get(response, 'data.day_datas[0]', 0)
    apr = new BigNumber(data.fee_apys.apy_7d).times(reduction) // 7 day moving average APY from trading fees
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
