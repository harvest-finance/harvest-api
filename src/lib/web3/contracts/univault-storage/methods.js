const { countFunctionCall } = require('../..')

const getPosId = instance => countFunctionCall(instance.methods.posId().call())

module.exports = { getPosId }
