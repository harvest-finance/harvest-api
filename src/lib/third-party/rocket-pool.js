const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')
const { CHAIN_TYPES, ROCKETPOOL_API_URLS } = require('../constants')

const getYearlyAPR = networkId => {
  let apiURL
  if (networkId == CHAIN_TYPES.ETH) {
    apiURL = ROCKETPOOL_API_URLS.ETH
  }

  return cachedAxios
    .get(apiURL)
    .then(response => {
      const data = get(response, `data.yearlyAPR`)
      if (data) {
        return data
      } else {
        console.error(get(response, 'data.errors', response))
        return null
      }
    })
    .catch(error => {
      console.error(`Rocket Pool APRs api failed:`, error)
      return null
    })
}

module.exports = { getYearlyAPR }
