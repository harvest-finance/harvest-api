const { toArray, isArray } = require('lodash')
const { cache } = require('../lib/cache')
const { UI_DATA_FILES, GET_PRICE_TYPES, CHAIN_TYPES } = require('../lib/constants')
const { getUIData } = require('../lib/data')
const {
  getTokenPriceByAddress,
  getTokenPriceById,
  priceByAddresses,
  priceByIds,
} = require('./coingecko')

const executePriceFunction = async (type, params) => {
  let implementation
  const transformedType = type.toLowerCase().replace(/_/g, '-')
  try {
    implementation = require(`./implementations/${transformedType}.js`)
  } catch (e) {
    console.error(
      `executePriceFunction(...) implementation for '${transformedType}' [${type}] is not available`,
      e,
    )
    return Promise.resolve(0)
  }

  const price = await implementation.getPrice(...params)
  return Promise.resolve(price)
}

const getTokenPrice = async (selectedToken, ourChainId = CHAIN_TYPES.ETH) => {
  const currency = 'usd'
  const normalizedSelectedToken = selectedToken.toLowerCase()
  const cachedPriceKey1 = `tokenPrice${normalizedSelectedToken}${ourChainId}${currency}`
  const cachedPrice1 = cache.get(cachedPriceKey1)

  if (cachedPrice1) {
    return cachedPrice1
  }

  const tokens = await getUIData(UI_DATA_FILES.TOKENS)

  let cachedPriceKey2 = null,
    result
  if (
    tokens[selectedToken] &&
    tokens[selectedToken].tokenAddress &&
    !isArray(tokens[selectedToken].tokenAddress)
  ) {
    const normalizedTokenAddress = tokens[selectedToken].tokenAddress.toLowerCase()
    const cachedPriceKey2 = `tokenPrice${normalizedTokenAddress}${ourChainId}${currency}`
    const cachedPrice2 = cache.get(cachedPriceKey2)

    if (cachedPrice2) {
      return cachedPrice2
    }
  }

  //Hotfix for fWETH, fUSDC, fUSDT price
  if (selectedToken == '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e') {
    return await getTokenPriceById('ethereum')
  } else if (selectedToken == '0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE') {
    return await getTokenPriceById('usd-coin')
  } else if (selectedToken == '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C') {
    return await getTokenPriceById('tether')
  }

  // next, checking if the staking token is a regular token
  const tokenData =
    tokens[selectedToken] ||
    toArray(tokens).find(
      token =>
        token.tokenAddress &&
        !isArray(token.tokenAddress) &&
        token.tokenAddress.toLowerCase() === selectedToken.toLowerCase(),
    )
  if (tokenData) {
    result = await executePriceFunction(
      tokenData.priceFunction.type,
      tokenData.priceFunction.params,
    )
  } else {
    // first, checking if staking token is an f-token (vault)
    const vaultData =
      !tokens[selectedToken] &&
      toArray(tokens).find(
        token =>
          token.chain === ourChainId &&
          token.vaultAddress &&
          token.vaultAddress.toLowerCase() === selectedToken.toLowerCase(),
      )
    if (vaultData) {
      result = await executePriceFunction(GET_PRICE_TYPES.F_TOKEN, [
        vaultData.vaultAddress,
        vaultData.decimals,
        ourChainId,
      ])
    } else {
      // otherwise, just fallback to CoinGecko
      result = selectedToken.startsWith('0x')
        ? await getTokenPriceByAddress(selectedToken, ourChainId, currency)
        : await getTokenPriceById(selectedToken, ourChainId, currency)
    }
  }

  cache.set(cachedPriceKey1, result)
  if (cachedPriceKey2) {
    cache.set(cachedPriceKey2, result)
  }
  return result
}

module.exports = {
  getTokenPrice,
  prefetchPriceByAddresses: priceByAddresses,
  prefetchPriceByIds: priceByIds,
}
