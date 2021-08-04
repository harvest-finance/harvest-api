const BigNumber = require('bignumber.js')
const axios = require('axios')
const { get, find } = require('lodash')

const { VENUS_API_URL } = require('../../../lib/constants')

const getApy = async (marketSymbol, profitSharingFactor) => {
  const response = await axios.get(VENUS_API_URL)

  const { supplyApy, supplyVenusApy } = find(
    get(response, 'data.data.markets', []),
    market => market.symbol === marketSymbol,
    { supplyApy: 0, supplyVenusApy: 0 },
  )

  const apy = new BigNumber(supplyApy).plus(supplyVenusApy).times(profitSharingFactor).toFixed()

  return apy
}

module.exports = {
  getApy,
}
