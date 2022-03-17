const { countFunctionCall } = require('../..')

const getCap = instance => countFunctionCall(instance.methods.getCap().call())
const getDepositCapReached = instance => countFunctionCall(instance.methods.depositCapReached().call())
const getWithdrawalTimestamp = instance => countFunctionCall(instance.methods.getWithdrawalTimestamp().call())
const getCurrentCap = instance => countFunctionCall(instance.methods.currentValueInCapToken().call())

module.exports = { getCap, getDepositCapReached, getWithdrawalTimestamp, getCurrentCap }