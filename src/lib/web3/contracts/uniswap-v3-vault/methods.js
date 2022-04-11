const { countFunctionCall } = require('../..')

const getCap = instance => countFunctionCall(instance.methods.getCap().call())
const getDepositCapReached = instance =>
  countFunctionCall(instance.methods.depositCapReached().call())
const getWithdrawalTimestamp = instance =>
  countFunctionCall(instance.methods.getWithdrawalTimestamp().call())
const getCurrentCap = instance =>
  countFunctionCall(instance.methods.currentValueInCapToken().call())
const getPositionIds = instance => countFunctionCall(instance.methods.getPositionIds().call())
const getCurrentRangePositionId = instance =>
  countFunctionCall(instance.methods.getCurrentRangePositionId().call())

module.exports = {
  getCap,
  getDepositCapReached,
  getWithdrawalTimestamp,
  getCurrentCap,
  getPositionIds,
  getCurrentRangePositionId,
}
