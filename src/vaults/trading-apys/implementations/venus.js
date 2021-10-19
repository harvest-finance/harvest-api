const BigNumber = require('bignumber.js')
const { get, find } = require('lodash')

const { VENUS_API_URL } = require('../../../lib/constants')
const { cachedAxios } = require('../../../lib/db/models/cache')

const getTradingApy = async marketSymbol => {
  let apy

  try {
    const response = await cachedAxios.get(VENUS_API_URL)

    const { supplyApy } = find(
      get(response, 'data.data.markets', []),
      market => market.symbol === marketSymbol,
      { supplyApy: 0 },
    )

    apy = new BigNumber(supplyApy)
  } catch (err) {
    console.error('Venus API error: ', err)
    apy = new BigNumber(0)
  }

  return apy.toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
