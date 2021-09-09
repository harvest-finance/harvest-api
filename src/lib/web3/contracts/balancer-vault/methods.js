const { countFunctionCall } = require('../..')

const getPoolTokens = (poolId, instance) =>
  countFunctionCall(instance.methods.getPoolTokens(poolId).call())

module.exports = {
  getPoolTokens,
}
