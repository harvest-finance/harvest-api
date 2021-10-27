const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.getPoolInfo(poolId).call())

module.exports = { getPoolInfo }
