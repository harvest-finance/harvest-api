const { countFunctionCall } = require('../..')

const getRewardPerBlock = instance =>
  countFunctionCall(instance.methods.currentRewardPerBlock().call())
const getEndBlock = instance => countFunctionCall(instance.methods.periodEndBlock().call())
const getRewardToken = instance => countFunctionCall(instance.methods.rewardToken().call())
const getStakedToken = instance => countFunctionCall(instance.methods.looksRareToken().call())
const getTokenDistributor = instance =>
  countFunctionCall(instance.methods.tokenDistributor().call())
const getTotalShares = instance => countFunctionCall(instance.methods.totalShares().call())
const getSharePrice = instance =>
  countFunctionCall(instance.methods.calculateSharePriceInLOOKS().call())

module.exports = {
  getRewardPerBlock,
  getEndBlock,
  getRewardToken,
  getStakedToken,
  getTokenDistributor,
  getTotalShares,
  getSharePrice,
}
