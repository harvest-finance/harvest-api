const { countFunctionCall } = require('../..')

const getEpochPoolSize = (tokenAddress, epochId, instance) =>
  countFunctionCall(instance.methods.getEpochPoolSize(tokenAddress, epochId).call())

const getCurrentEpoch = instance => countFunctionCall(instance.methods.getCurrentEpoch().call())

module.exports = {
  getEpochPoolSize,
  getCurrentEpoch,
}
