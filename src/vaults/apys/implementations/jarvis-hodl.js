const BigNumber = require('bignumber.js')

const { getApy: getNativeAPY } = require('./jarvis.js')
const { UI_DATA_FILES } = require('../../../lib/constants')
const { getUIData } = require('../../../lib/data')
const { executeEstimateApyFunctions } = require('..')

const getApy = async (...params) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  let nativeApr = new BigNumber(await getNativeAPY(...params))
  const hodlVaultData = tokens['jarvis_AUR_USDC']
  const { estimatedApy } = await executeEstimateApyFunctions(
    'jarvis_AUR_USDC',
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
