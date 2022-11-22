const { countFunctionCall } = require('../..')

const getPoolData = (lpAddress, instance) =>
  countFunctionCall(instance.methods.getPoolData(lpAddress).call())

module.exports = { getPoolData }
