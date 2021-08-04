const { countFunctionCall } = require('../..')

const getExchangeRateStored = instance =>
  countFunctionCall(instance.methods.exchangeRateStored().call())

module.exports = { getExchangeRateStored }
