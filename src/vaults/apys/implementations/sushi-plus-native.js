const BigNumber = require('bignumber.js')

const { getApy: getSushiAPY } = require('./sushi.js')
const { UI_DATA_FILES } = require('../../../lib/constants')
const { getUIData } = require('../../../lib/data')
const { executeEstimateApyFunctions } = require('..')

const getApy = async (...params) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  let sushiApr = new BigNumber(await getSushiAPY(...params))
  const hodlVaultData = tokens['SUSHI_HODL']
  const { estimatedApy } = await executeEstimateApyFunctions(
    'SUSHI_HODL',
    hodlVaultData.estimateApyFunctions,
  )
  let hodlApr = new BigNumber(estimatedApy)
  let hodlApy = new BigNumber(hodlApr.div(36500).plus(1).pow(365).minus(1).times(100))
  let yearlyApr = sushiApr.times(hodlApy).div(2).div(hodlApr.div(2)).toFixed(2, 1)
  return yearlyApr
}
module.exports = {
  getApy,
}
