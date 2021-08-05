const { countFunctionCall } = require('../..')

const getExchangeRateStored = instance =>
  countFunctionCall(instance.methods.exchangeRateStored().call())

const getSupplyRatePerBlock = instance =>
  countFunctionCall(instance.methods.supplyRatePerBlock().call())

module.exports = { getExchangeRateStored, getSupplyRatePerBlock }
