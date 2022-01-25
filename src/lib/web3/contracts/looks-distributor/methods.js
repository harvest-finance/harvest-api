const { countFunctionCall } = require('../..')

const getRewardPerBlockForStaking = instance =>
  countFunctionCall(instance.methods.rewardPerBlockForStaking().call())

module.exports = { getRewardPerBlockForStaking }
