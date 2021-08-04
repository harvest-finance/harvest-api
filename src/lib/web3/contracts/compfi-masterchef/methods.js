const getPoolInfo = (poolId, instance) => instance.methods.poolInfo(poolId).call()
const getTotalAllocPoint = instance => instance.methods.totalAllocPoint().call()
const getCompfiPerBlock = instance => instance.methods.rewardPerBlock().call()

module.exports = { getPoolInfo, getTotalAllocPoint, getCompfiPerBlock }
