const { countFunctionCall } = require('../..')

const getRewardData = (addr, instance) =>
  countFunctionCall(instance.methods.reward_data(addr).call())
const getRewardToken = (index, instance) =>
  countFunctionCall(instance.methods.reward_tokens(index).call())
const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  getRewardData,
  getRewardToken,
  getTotalSupply,
}
