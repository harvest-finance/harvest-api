const { countFunctionCall } = require('../..')

const balanceOf = (address, instance) =>
  countFunctionCall(instance.methods.balanceOf(address).call())

const periodFinish = instance => countFunctionCall(instance.methods.periodFinish().call())

const rewardPerTokenA = instance => countFunctionCall(instance.methods.rewardPerTokenA().call())
const rewardPerTokenB = instance => countFunctionCall(instance.methods.rewardPerTokenB().call())

const rewardRateA = instance => countFunctionCall(instance.methods.rewardRateA().call())
const rewardRateB = instance => countFunctionCall(instance.methods.rewardRateB().call())

const totalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

const rewardsA = (token, instance) => countFunctionCall(instance.methods.rewardsA(token).call())
const rewardsB = (token, instance) => countFunctionCall(instance.methods.rewardsB(token).call())

const rewardsTokenA = instance => countFunctionCall(instance.methods.rewardsTokenA().call())
const rewardsTokenB = instance => countFunctionCall(instance.methods.rewardsTokenB().call())
const stakingToken = instance => countFunctionCall(instance.methods.stakingToken().call())

const earnedA = (address, instance) => countFunctionCall(instance.methods.earnedA(address).call())
const earnedB = (address, instance) => countFunctionCall(instance.methods.earnedB(address).call())

module.exports = {
  balanceOf,
  periodFinish,
  rewardPerTokenA,
  rewardPerTokenB,
  rewardRateA,
  rewardRateB,
  totalSupply,
  rewardsA,
  rewardsB,
  rewardsTokenA,
  rewardsTokenB,
  stakingToken,
  earnedA,
  earnedB,
}
