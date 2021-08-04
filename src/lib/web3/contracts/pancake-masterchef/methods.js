const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getCakePerBlock = instance => countFunctionCall(instance.methods.cakePerBlock().call())

module.exports = { getPoolInfo, getTotalAllocPoint, getCakePerBlock }
