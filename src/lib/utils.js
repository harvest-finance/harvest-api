const BigNumber = require('bignumber.js')

const getDailyCompound = yearlyApr =>
  new BigNumber(1)
    .plus(new BigNumber(yearlyApr).dividedBy(36500))
    .exponentiatedBy(365)
    .minus(1)
    .multipliedBy(100)
    .toFixed(2)

const getWeeklyCompound = yearlyApr =>
  new BigNumber(1)
    .plus(new BigNumber(yearlyApr).dividedBy(5200))
    .exponentiatedBy(52)
    .minus(1)
    .multipliedBy(100)
    .toFixed(2)

module.exports = {
  getDailyCompound,
  getWeeklyCompound,
}
