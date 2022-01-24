const { countFunctionCall } = require('../..')

const getRewardPerBlock = instance => countFunctionCall(instance.methods.rewardPerBlock().call())
const getEndBlock = instance => countFunctionCall(instance.methods.endBlock().call())
const getStakedToken = instance => countFunctionCall(instance.methods.stakedToken().call())

module.exports = { getRewardPerBlock, getEndBlock, getStakedToken }
