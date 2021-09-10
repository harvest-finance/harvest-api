const { sumBy, orderBy, isArray } = require('lodash')
const Web3 = require('web3')
const {
  INFURA_URL,
  BSC_RPC_URL,
  MATIC_RPC_URL,
  CHAIN_TYPES,
  WEB3_CALL_COUNT_STATS_KEY,
  WEB3_CALL_COUNT_KEY,
  INFURA_WS_URL,
} = require('../constants')
const { cache } = require('../cache')

const web3 = new Web3(INFURA_URL)
const web3BSC = new Web3(BSC_RPC_URL)
const web3MATIC = new Web3(MATIC_RPC_URL)

const web3Socket = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS_URL))

const getWeb3 = chainId => {
  switch (chainId) {
    case CHAIN_TYPES.BSC:
      return web3BSC
    case CHAIN_TYPES.MATIC:
      return web3MATIC
    default:
      return web3
  }
}

const countFunctionCall = fn => {
  const count = cache.get(WEB3_CALL_COUNT_KEY) || 0
  cache.set(WEB3_CALL_COUNT_KEY, count + 1)

  return fn
}

const resetCallCount = () => {
  cache.set(WEB3_CALL_COUNT_KEY, 0)
}

const getCallCount = () => cache.get(WEB3_CALL_COUNT_KEY)

const updateCallCountCache = key => {
  const currentCache = cache.get(WEB3_CALL_COUNT_STATS_KEY)
  cache.set(WEB3_CALL_COUNT_STATS_KEY, { ...currentCache, [key]: getCallCount() })
}

const printCallCountResults = () => {
  const { gmv, revenue, tokenStats, cmc, vaults, pools } = cache.get(WEB3_CALL_COUNT_STATS_KEY)

  console.log('\n################## Web3 Call Count Results ###################')
  console.log('\nGMV calculation: ', gmv)
  console.log('\nRevenue calculation: ', revenue)
  console.log('\nFARM token stats calculation: ', tokenStats)
  console.log('\nCMC endpoint data calculation: ', cmc)
  console.log('\nPool data retreval total: ', sumBy(pools, 'callCount'))
  console.log('\nPool data retreval by pool: ')
  for (let { poolId, callCount } of orderBy(pools, 'callCount', 'desc')) {
    console.log(`${poolId}: ${callCount}`)
  }

  console.log('\nVault data retreval total: ', sumBy(vaults, 'callCount'))
  console.log('\nVault data retreval by vault: ')
  for (let { symbol, callCount } of orderBy(vaults, 'callCount', 'desc')) {
    console.log(`${symbol}: ${callCount}`)
  }

  console.log('\n##############################################################')
}

const hasAddress = (tokenAddress, selectedAddress) =>
  isArray(tokenAddress)
    ? tokenAddress.includes(selectedAddress.toLowerCase())
    : tokenAddress.toLowerCase() === selectedAddress.toLowerCase()

module.exports = {
  web3,
  web3Socket,
  web3BSC,
  web3MATIC,
  getWeb3,
  countFunctionCall,
  resetCallCount,
  getCallCount,
  printCallCountResults,
  updateCallCountCache,
  hasAddress,
}
