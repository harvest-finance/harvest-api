const { countFunctionCall } = require('../..')

const getTradeInfo = instance => countFunctionCall(instance.methods.getTradeInfo().call())
const getToken0 = instance => countFunctionCall(instance.methods.token0().call())
const getToken1 = instance => countFunctionCall(instance.methods.token1().call())

module.exports = { getTradeInfo, getToken0, getToken1 }
