const BigNumber = require('bignumber.js')

const { getApy: getSushiAPY } = require('./sushi.js')
const { getApy: getSushiHODLApy } = require('./native-sushi.js')

const getApy = async (...params) => {
  let yearlyApr = await getSushiAPY(...params)
  yearlyApr = new BigNumber(yearlyApr).plus(await getSushiHODLApy()).toString()
  return yearlyApr
}

module.exports = {
  getApy,
}
