const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getRewardPerBlock = instance => countFunctionCall(instance.methods.rwdPerBlock().call())
const totalAllocPoints = instance => countFunctionCall(instance.methods.totalAllocPoints().call())
const getRewardToken = instance => countFunctionCall(instance.methods.rwdToken().call())
const getEndBlock = instance => countFunctionCall(instance.methods.endBlock().call())

module.exports = { getPoolInfo, getRewardPerBlock, totalAllocPoints, getRewardToken, getEndBlock }
