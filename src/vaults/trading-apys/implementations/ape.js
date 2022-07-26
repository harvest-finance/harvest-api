const BigNumber = require('bignumber.js')
const { get } = require('lodash')

const { APE_API_URL } = require('../../../lib/constants')
const { cachedAxios } = require('../../../lib/db/models/cache')

const getTradingApy = async (poolId, networkId) => {
  let apy

  try {
    const response = await cachedAxios.get(
      `${APE_API_URL}/stats/network/lpAprs/${parseInt(networkId)}`,
    )

    let apeAPR = get(response, `data.lpAprs[${parseInt(poolId)}].lpApr`, 0)

    apy = new BigNumber(apeAPR)
  } catch (err) {
    console.error('APE API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
