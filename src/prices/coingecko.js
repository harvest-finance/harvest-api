const axios = require('axios')
const { get } = require('lodash')
const { setupCache } = require('axios-cache-adapter')

const { cache } = require('../lib/cache')
const {
  COINGECKO_PRICE_API_ENDPOINT_CONTRACT,
  COINGECKO_PRICE_API_ENDPOINT_ID,
  CG_CACHE_TTL,
  CHAIN_TYPES,
} = require('../lib/constants')
const rateLimit = require('axios-rate-limit')

const cgCache = setupCache({
  maxAge: CG_CACHE_TTL,
  exclude: {
    query: false,
  },
})

const cgCall = rateLimit(
  axios.create({
    adapter: cgCache.adapter,
  }),
  { maxRequests: 95, perMilliseconds: 60000, maxRPS: 1 },
)

const getPlatformId = chain => {
  switch (chain) {
    case CHAIN_TYPES.BSC:
      return 'binance-smart-chain'
    case CHAIN_TYPES.MATIC:
      return 'polygon-pos'
    default:
      return 'ethereum'
  }
}

const priceByAddresses = (contractAddresses, ourChainId = CHAIN_TYPES.ETH, currency = 'usd') =>
  cgCall
    .get(`${COINGECKO_PRICE_API_ENDPOINT_CONTRACT}/${getPlatformId(ourChainId)}`, {
      params: {
        contract_addresses: contractAddresses,
        vs_currencies: currency,
      },
    })
    .then(res => {
      console.log('priceByAddresses: res.data', res.data)
      if (!Object.keys(res.data).length) {
        return Promise.reject(new Error('No price for', contractAddresses))
      }
      return Object.keys(res.data).map(address => {
        const fetchedAddress = address.toLowerCase()
        const fetchedPrice = get(res, `data[${address}][${currency}]`, 0)
        cache.set(`tokenPrice${fetchedAddress}${ourChainId}${currency}`, fetchedPrice)
        return fetchedPrice
      })
    })
    .catch(err => {
      console.error(`Error getting price from CoinGecko for token at: ${contractAddresses}`, err)
      return err
    })

const priceByIds = (ids, currency) =>
  cgCall
    .get(COINGECKO_PRICE_API_ENDPOINT_ID, {
      params: {
        ids: ids,
        vs_currencies: currency,
      },
    })
    .then(res => {
      console.log('priceByIds: res.data', res.data)
      if (!Object.keys(res.data).length) {
        return Promise.reject(new Error('No price for', ids))
      }
      return Object.keys(res.data).map(id => {
        const fetchedPrice = get(res, `data[${id}][${currency}]`, 0)
        cache.set(`tokenPrice${id}${CHAIN_TYPES.ETH}${currency}`, fetchedPrice)
        return fetchedPrice
      })
    })
    .catch(err => {
      console.error(`Error getting price from CoinGecko for token at: ${ids}`, err)
      return err
    })

const getTokenPriceByAddress = async (
  contractAddress,
  ourChainId = CHAIN_TYPES.ETH,
  currency = 'usd',
) => {
  const formattedContractAddress = contractAddress.toLowerCase()
  const tokenPrice = cache.get(`tokenPrice${formattedContractAddress}${ourChainId}${currency}`)

  if (tokenPrice) {
    return tokenPrice
  }

  const result = await priceByAddresses(formattedContractAddress, ourChainId, currency)
  return result[0]
}

const getTokenPriceById = async (id, currency = 'usd') => {
  const tokenPrice = cache.get(`tokenPrice${id}${CHAIN_TYPES.ETH}${currency}`)

  if (tokenPrice) {
    return tokenPrice
  }

  const result = await priceByIds(id, currency)
  return result[0]
}

module.exports = {
  getTokenPriceByAddress,
  getTokenPriceById,
  priceByAddresses,
  priceByIds,
}
