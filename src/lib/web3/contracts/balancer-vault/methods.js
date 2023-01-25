const { countFunctionCall } = require('../..')

const getPoolTokens = (poolId, instance) =>
  countFunctionCall(instance.methods.getPoolTokens(poolId).call())
const getLpToken = (poolId, instance) => countFunctionCall(instance.methods.getPool(poolId).call())

module.exports = {
  getPoolTokens,
  getLpToken,
}
