const { countFunctionCall } = require('../..')

const stEthPerToken = instance => countFunctionCall(instance.methods.stEthPerToken().call())

module.exports = { stEthPerToken }
