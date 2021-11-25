const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const rewardPerBlock = instance => countFunctionCall(instance.methods.rwdPerBlock().call())
const totalAllocPoints = instance => countFunctionCall(instance.methods.totalAllocPoints().call())

module.exports = { getPoolInfo, rewardPerBlock, totalAllocPoints }
