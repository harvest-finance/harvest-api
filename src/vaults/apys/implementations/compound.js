const BigNumber = require('bignumber.js')
const { COMPOUND_CTOKEN_API_URL } = require('../../../lib/constants')
const { getDailyCompound } = require('../../../lib/utils')
const { get } = require('lodash')
const { cachedAxios } = require('../../../lib/db/models/cache')

const getApy = async (tokenAddress, subtractProfitShare = true) => {
  try {
    const apiResponse = await cachedAxios.get(COMPOUND_CTOKEN_API_URL, {
      params: { addresses: [tokenAddress] },
    })

    // the supply_rate needs to be multiplied by 100
    const apy = Number(get(apiResponse, 'data.cToken[0].supply_rate.value', 0)) * 100
    let compApy = Number(get(apiResponse, 'data.cToken[0].comp_supply_apy.value', 0))

    if (subtractProfitShare) {
      compApy *= 0.7
    }

    return new BigNumber(apy + Number(getDailyCompound(compApy))).toFixed(2)
  } catch (err) {
    console.error('Compound REST API Failure: ', err)
    return 0
  }
}

module.exports = {
  getApy,
}
