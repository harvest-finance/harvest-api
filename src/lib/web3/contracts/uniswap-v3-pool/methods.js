const { countFunctionCall } = require('../..')

const getSlot = instance => countFunctionCall(instance.methods.slot0().call())

module.exports = { getSlot }
