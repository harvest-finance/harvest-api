const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')

const BALANCER_SUBGRAPH_MAINNET =
  'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2'

const executeBalancerCall = (type, query) =>
  cachedAxios
    .post(BALANCER_SUBGRAPH_MAINNET, JSON.stringify({ query }))
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

const getPoolInfo = poolAddress => {
  const query = `query {
    pools (where: {id: "${poolAddress}"}) { swapFee totalLiquidity }
  }`

  return executeBalancerCall('pools[0]', query)
}

const getPoolSnapshot = (poolId, timestamp) => {
  const query = `query { poolSnapshots(where: { timestamp: ${timestamp}, pool: "${poolId}" } ) { swapFees } }`

  return executeBalancerCall('poolSnapshots[0]', query)
}

module.exports = {
  getPoolInfo,
  getPoolSnapshot,
}
