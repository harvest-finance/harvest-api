const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getBananaPerSecond = instance => countFunctionCall(instance.methods.bananaPerSecond().call())
const getBananaLpToken = (poolId, instance) =>
  countFunctionCall(instance.methods.lpToken(poolId).call())

module.exports = { getPoolInfo, getTotalAllocPoint, getBananaPerSecond, getBananaLpToken }
