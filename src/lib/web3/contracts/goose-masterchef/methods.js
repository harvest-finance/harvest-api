const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getEggPerBlock = instance => countFunctionCall(instance.methods.eggPerBlock().call())

module.exports = { getPoolInfo, getTotalAllocPoint, getEggPerBlock }
