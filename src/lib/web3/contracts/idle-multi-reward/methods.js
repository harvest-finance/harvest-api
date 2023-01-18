const { countFunctionCall } = require('../..')

const rewardData = (rewardToken, instance) =>
  countFunctionCall(instance.methods.rewardData(rewardToken).call())

module.exports = {
  rewardData,
}
