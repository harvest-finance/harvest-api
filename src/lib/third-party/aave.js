const axios = require('axios')
const { get } = require('lodash')

const getAaveV2Market = () =>
  axios
    .get('https://aave-api-v2.aave.com/data/markets-data/')
    .then(response => get(response, 'data'))
    .catch(error => {
      console.error('getAaveV2Market() failed:', error)
      return null
    })

module.exports = {
  getAaveV2Market,
}
