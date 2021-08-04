const { countFunctionCall } = require('../..')

const getStorage = instance => countFunctionCall(instance.methods.getStorage().call())

module.exports = { getStorage }
