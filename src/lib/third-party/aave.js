const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')

const getAaveV2Market = () =>
  cachedAxios
    .get('https://aave-api-v2.aave.com/data/markets-data/')
    .then(response => get(response, 'data'))
    .catch(error => {
      console.error('getAaveV2Market() failed:', error)
      return null
    })

module.exports = {
  getAaveV2Market,
}
