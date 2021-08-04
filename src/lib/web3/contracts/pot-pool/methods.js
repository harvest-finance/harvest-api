const { countFunctionCall } = require('../..')

const balanceOf = (address, instance) =>
  countFunctionCall(instance.methods.balanceOf(address).call())

const periodFinish = instance => countFunctionCall(instance.methods.periodFinish().call())

const rewardPerTokenByAddress = (address, instance) =>
  countFunctionCall(instance.methods.rewardPerToken(address).call())

const rewardRate = instance => countFunctionCall(instance.methods.rewardRate().call())

const totalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

const tokenRewards = (token, instance) =>
  countFunctionCall(instance.methods.tokenRewards(token).call())

const lpToken = instance => countFunctionCall(instance.methods.lpToken().call())

const earned = (address, instance) => countFunctionCall(instance.methods.earned(address).call())

const rewardRateForToken = (address, instance) =>
  countFunctionCall(instance.methods.rewardRateForToken(address).call())

const periodFinishForToken = (address, instance) =>
  countFunctionCall(instance.methods.periodFinishForToken(address).call())

module.exports = {
  balanceOf,
  periodFinish,
  rewardPerTokenByAddress,
  rewardRateForToken,
  periodFinishForToken,
  rewardRate,
  totalSupply,
  lpToken,
  earned,
  tokenRewards,
}
