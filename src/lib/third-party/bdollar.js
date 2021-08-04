const axios = require('axios')
const axiosRetry = require('axios-retry')
const { BDO_API_URL } = require('../constants')

const bdoApi = axios.create({ baseURL: BDO_API_URL })

axiosRetry(bdoApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 303),
})

module.exports = bdoApi
