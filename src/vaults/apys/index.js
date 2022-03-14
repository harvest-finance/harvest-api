/* eslint-disable  one-var */
const BigNumber = require('bignumber.js')
const { forEach } = require('promised-loops')
const { cache } = require('../../lib/cache')
const { getDailyCompound } = require('../../lib/utils')

const getYearlyAPR = async (type, params, share) => {
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

  let yearlyApr = params ? await implementation.getApy(...params) : await implementation.getApy()

  if (share) {
    yearlyApr = new BigNumber(yearlyApr).div(100).times(share)
  }

  return yearlyApr
}

const getEstimatedApy = async (type, params, share, extraDailyCompound = true) => {
  let estimatedApy = await getYearlyAPR(type, params, share)

  if (extraDailyCompound) {
    estimatedApy = getDailyCompound(estimatedApy)
  }

  return estimatedApy
}

const executeEstimateApyFunctions = async (vaultSymbol, apyFunctions) => {
  const cachedEstimatedApyKey = `estimated-apy-data-${vaultSymbol}`

  const cachedApy = cache.get(cachedEstimatedApyKey)

  if (cachedApy) {
    return cachedApy
  }

  let estimatedApy = new BigNumber(0)
  const estimatedApyBreakdown = []

  await forEach(apyFunctions, async apyFunction => {
    const { type, params, share, extraDailyCompound } = apyFunction

    const apy = await getEstimatedApy(type, params, share, extraDailyCompound)

    estimatedApy = estimatedApy.plus(apy)
    estimatedApyBreakdown.push(apy)
  })

  const apyStats = {
    estimatedApy: estimatedApy.toString(),
    estimatedApyBreakdown,
  }

  cache.set(cachedEstimatedApyKey, apyStats)

  return Promise.resolve(apyStats)
}

module.exports = {
  executeEstimateApyFunctions,
}
