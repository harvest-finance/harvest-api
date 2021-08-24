const { get } = require('lodash')
const { cache } = require('../cache')
const { cachedAxios } = require('../db/models/cache')

const getApyFromCurveApi = poolId =>
  cachedAxios
    .get('https://stats.curve.fi/raw-stats/apys.json')
    .then(res => get(res, `data.apy.day[${poolId}]`, 0))
    .catch(err => {
      console.error(`getApyFromCurveApi(${poolId}) failed:`, err)
      return 0
    })

const getApyFromCurvePushService = (poolId, params) =>
  cachedAxios
    .get(`http://pushservice.curve.fi/apys/${poolId}`)
    .then(async res => {
      const desiredItem = res.data.lendRates
        ? res.data.lendRates.find(item => item.tokenSymbol === params[1])
        : null

      return desiredItem ? desiredItem.apy : 0
    })
    .catch(err => {
      console.error(`getApyFromCurvePushService(${poolId}) failed:`, err)
      return 0
    })

const getCurveLendRate = async params => {
  const poolId = params[0]

  if (poolId == 'manual') {
    return params[1]
  }

  const storedLendApy = cache.get(`lendRate.${params.join('.')}`)

  if (storedLendApy) {
    return storedLendApy
  }

  let lendApy = await getApyFromCurveApi(poolId)

  if (!lendApy) {
    lendApy = await getApyFromCurvePushService(poolId, params)
  }

  lendApy = lendApy ? lendApy * 100 : 0

  cache.set(`lendRate.${params.join('.')}`, lendApy)

  return lendApy
}

module.exports = getCurveLendRate
