const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getYelPerSecond = instance => countFunctionCall(instance.methods.yelPerSecond().call())

module.exports = { getPoolInfo, getTotalAllocPoint, getYelPerSecond }
