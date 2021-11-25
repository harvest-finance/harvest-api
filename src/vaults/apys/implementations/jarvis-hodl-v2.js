const BigNumber = require('bignumber.js')

const { getApy: getNativeAPY } = require('./jarvis-v2.js')
const { UI_DATA_FILES } = require('../../../lib/constants')
const { getUIData } = require('../../../lib/data')
const { executeEstimateApyFunctions } = require('..')

const getApy = async (poolId, underlying, reduction) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  let nativeApr = new BigNumber(await getNativeAPY(poolId, underlying, reduction))
  const hodlVaultData = tokens['jarvis_DEN_4EUR']
  const { estimatedApy } = await executeEstimateApyFunctions(
    'jarvis_DEN_4EUR',
    hodlVaultData.estimateApyFunctions,
  )
  let hodlApy = estimatedApy
  let hodlApr = new BigNumber((Math.pow(hodlApy / 100 + 1, 1 / 365) - 1) * 36500)
  let yearlyApr = nativeApr.times(hodlApy).div(2).div(hodlApr.div(2)).toFixed(2, 1)
  return yearlyApr
}
module.exports = {
  getApy,
}
