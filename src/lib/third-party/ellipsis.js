const axios = require('axios')
const axiosRetry = require('axios-retry')
const { ELLIPSIS_API_URL } = require('../constants')

const ellipsisApi = axios.create({ baseURL: ELLIPSIS_API_URL })

axiosRetry(ellipsisApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 303),
})

module.exports = ellipsisApi
