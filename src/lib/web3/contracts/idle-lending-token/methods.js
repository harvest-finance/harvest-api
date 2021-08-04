const { countFunctionCall } = require('../..')
const getVirtualPrice = instance => countFunctionCall(instance.methods.tokenPrice().call())

const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  getVirtualPrice,
  getTotalSupply,
}
