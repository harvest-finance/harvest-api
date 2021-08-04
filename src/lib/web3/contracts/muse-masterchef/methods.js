const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getMusePerBlock = instance => countFunctionCall(instance.methods.musePerBlock().call())

module.exports = { getPoolInfo, getTotalAllocPoint, getMusePerBlock }
