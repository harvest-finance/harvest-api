const { cache } = require('../../lib/cache')

const executeTradingApyFunction = async (type, params) => {
  const cachedApyKey = `trading-apy${type}-${JSON.stringify(params)}`

  const cachedApy = cache.get(cachedApyKey)

  if (cachedApy) {
    return cachedApy
  }

  let implementation
  const transformedType = type.toLowerCase().replace(/_/g, '-')
  try {
    implementation = require(`./implementations/${transformedType}.js`)
  } catch (e) {
    console.error(
      `getYearlyAPR(...) implementation for '${transformedType}' [${type}] is not available`,
      e,
    )
    return Promise.resolve(0)
  }

  const apy = await implementation.getTradingApy(...params)
  cache.set(cachedApyKey, apy)

  return Promise.resolve(apy)
}

const getTradingApy = async pool => {
  if (pool.tradingApyFunction) {
    const { type, params } = pool.tradingApyFunction
    return executeTradingApyFunction(type, params)
  }

  return undefined // intentional
}

module.exports = {
  getTradingApy,
  executeTradingApyFunction,
}
