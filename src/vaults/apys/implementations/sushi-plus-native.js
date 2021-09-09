const BigNumber = require('bignumber.js')

const { getApy: getSushiAPY } = require('./sushi.js')
const { getApy: getSushiHODLApy } = require('./native-sushi.js')

const getApy = async (...params) => {
  let sushiApr = new BigNumber(await getSushiAPY(...params)),
    hodlApr = new BigNumber(await getSushiHODLApy()),
    hodlApy = new BigNumber(hodlApr.div(36500).plus(1).pow(365).minus(1).times(100))
  const yearlyApr = sushiApr.times(hodlApy).div(2).div(hodlApr.div(2)).toFixed(2, 1)
  return yearlyApr
}

module.exports = {
  getApy,
}
