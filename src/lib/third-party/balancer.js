const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')
const { CHAIN_TYPES, BALANCER_SUBGRAPH_URLS } = require('../constants')
const { balancerVault, token: tokenContract } = require('../web3/contracts')
const { getWeb3 } = require('../web3')
const { getTokenPrice } = require('../../prices')
const BigNumber = require('bignumber.js')

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

const getPoolInfo = (poolId, networkId) => {
  if (networkId == CHAIN_TYPES.ETH) {
    return getPoolInfoSubgraph(poolId, networkId)
  } else if (networkId == CHAIN_TYPES.MATIC) {
    return getPoolInfoOnChain(poolId, networkId)
  }
}

const getPoolInfoSubgraph = async (poolId, networkId) => {
  const poolQuery = `query {
    pools (where: {id: "${poolId}"}) { 
      totalLiquidity tokensList
      tokens (id: "${poolId}") { balance priceRate  }}
  }`

  const poolInfo = await executeBalancerCall('pools[0]', poolQuery, networkId)

  const tokensList = poolInfo.tokensList
  const tokens = poolInfo.tokens

  let tokenValues = {}
  await Promise.all(
    tokensList.map(async (token, index) => {
      const balance = new BigNumber(tokens[index].balance)
      const rate = new BigNumber(tokens[index].priceRate)

      const tokenQuery = `query {
        token (id: "${token}") { latestUSDPrice}
      }`

      const price = new BigNumber(
        await executeBalancerCall('token.latestUSDPrice', tokenQuery, networkId),
      )

      tokenValues[token] = balance.times(rate).times(price)
    }),
  )

  return { totalLiquidity: poolInfo.totalLiquidity, tokenValues: tokenValues }
}

const getPoolInfoOnChain = async (poolId, networkId) => {
  const {
    methods: { getPoolTokens, getLpToken },
    contract: {
      abi,
      address: { mainnet },
    },
  } = balancerVault

  const web3Instance = getWeb3(networkId)
  const balancerVaultInstance = new web3Instance.eth.Contract(abi, mainnet)

  const tokenInfo = await getPoolTokens(poolId, balancerVaultInstance)
  const lpToken = await getLpToken(poolId, balancerVaultInstance)
  let tokenValues = {}
  let totalValue = new BigNumber(0)
  for (let i = 0; i < tokenInfo.tokens.length; i++) {
    const token = tokenInfo.tokens[i]
    if (token == lpToken[0]) {
      continue
    }
    const tokenInstance = new web3Instance.eth.Contract(tokenContract.contract.abi, token)
    const tokenDecimals = await tokenContract.methods.getDecimals(tokenInstance)
    const amount = new BigNumber(tokenInfo.balances[i]).div(10 ** tokenDecimals)
    const tokenPrice = await getTokenPrice(token, networkId)
    const tokenValue = amount.times(tokenPrice)
    tokenValues[token] = tokenValue
    totalValue = totalValue.plus(tokenValue)
  }
  return { totalLiquidity: totalValue.toFixed(), tokenValues: tokenValues }
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
