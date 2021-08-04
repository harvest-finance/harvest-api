const { countFunctionCall } = require('../..')

const balanceOf = (address, instance) =>
  countFunctionCall(instance.methods.balanceOf(address).call())

const periodFinish = instance => countFunctionCall(instance.methods.periodFinish().call())

const rewardPerToken = instance => countFunctionCall(instance.methods.rewardPerToken().call())

const rewardRate = instance => countFunctionCall(instance.methods.rewardRate().call())

const rewardRatePerPool = (index, instance) =>
  countFunctionCall(instance.methods.rewardRatePerPool(index).call())

const totalSupply = (index, instance) =>
  countFunctionCall(instance.methods.totalSupply(index).call())

const lpToken = instance => countFunctionCall(instance.methods.lpToken().call())

const earned = (address, instance) => countFunctionCall(instance.methods.earned(address).call())

module.exports = {
  balanceOf,
  periodFinish,
  rewardPerToken,
  rewardRate,
  totalSupply,
  lpToken,
  earned,
  rewardRatePerPool,
}
