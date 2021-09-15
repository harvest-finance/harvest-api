const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')
const { CHAIN_TYPES, BALANCER_SUBGRAPH_URLS } = require('../constants')

const executeBalancerCall = (type, query, networkId) => {
  let subgraphURL
  if (networkId == CHAIN_TYPES.ETH) {
    subgraphURL = BALANCER_SUBGRAPH_URLS.ETH
  } else if (networkId == CHAIN_TYPES.MATIC) {
    subgraphURL = BALANCER_SUBGRAPH_URLS.MATIC
  }
  return cachedAxios
    .post(subgraphURL, JSON.stringify({ query }))
    .then(response => {
      const data = get(response, `data.data.${type}`)
      if (data) {
        return data
      } else {
        console.error(get(response, 'data.errors', response))
        return null
      }
    })
    .catch(error => {
      console.error(`Balancer subgraph (${query}) failed:`, error)
      return null
    })
}

const getPoolInfo = (poolAddress, networkId) => {
  const query = `query {
    pools (where: {id: "${poolAddress}"}) { swapFee totalLiquidity }
  }`
  let result = executeBalancerCall('pools[0]', query, networkId)
  return result
}

const getPoolSnapshot = (poolId, timestamp, networkId) => {
  const query = `query { poolSnapshots(where: { timestamp: ${timestamp}, pool: "${poolId}" } ) { swapFees } }`

  let result = executeBalancerCall('poolSnapshots[0]', query, networkId)
  return result
}

module.exports = {
  getPoolInfo,
  getPoolSnapshot,
}
