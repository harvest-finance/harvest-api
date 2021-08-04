const { countFunctionCall } = require('../..')

const getAmountsForPosition = (posId, instance) =>
  countFunctionCall(instance.methods.getAmountsForPosition(posId).call())

module.exports = { getAmountsForPosition }
