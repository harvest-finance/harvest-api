const { countFunctionCall } = require('../..')

const getPositions = (posId, instance) =>
  countFunctionCall(instance.methods.positions(posId).call())

module.exports = { getPositions }
