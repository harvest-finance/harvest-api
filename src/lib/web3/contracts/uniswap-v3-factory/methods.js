const { countFunctionCall } = require('../..')

const getPool = (token0, token1, fee, instance) =>
  countFunctionCall(instance.methods.getPool(token0, token1, fee).call())

module.exports = { getPool }
