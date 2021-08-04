const getPoolInfo = (poolId, instance) => instance.methods.poolInfo(poolId).call()
const getTotalAllocPoint = instance => instance.methods.totalAllocPoint().call()
const getIcePerSecond = instance => instance.methods.icePerSecond().call()

module.exports = { getPoolInfo, getTotalAllocPoint, getIcePerSecond }
