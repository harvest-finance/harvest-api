const { countFunctionCall } = require('../..')

const getRewardsBy = (poolId, from, to, instance) =>
  countFunctionCall(instance.methods.rewardsBy(poolId, from, to).call())
const getPool = (poolId, instance) => countFunctionCall(instance.methods.pools(poolId).call())

module.exports = {
  getRewardsBy,
  getPool,
}
