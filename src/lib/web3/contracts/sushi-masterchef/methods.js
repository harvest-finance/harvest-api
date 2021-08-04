const { countFunctionCall } = require('../..')

const getPoolInfo = (poolId, instance) =>
  countFunctionCall(instance.methods.poolInfo(poolId).call())
const getTotalAllocPoint = instance => countFunctionCall(instance.methods.totalAllocPoint().call())
const getSushiPerBlock = instance => countFunctionCall(instance.methods.sushiPerBlock().call())

module.exports = { getPoolInfo, getTotalAllocPoint, getSushiPerBlock }
