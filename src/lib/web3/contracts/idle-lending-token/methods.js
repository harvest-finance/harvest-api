const { countFunctionCall } = require('../..')
const getVirtualPrice = instance => countFunctionCall(instance.methods.tokenPrice().call())

const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

const getAvgAPR = instance => countFunctionCall(instance.methods.getAvgAPR().call())

module.exports = {
  getVirtualPrice,
  getTotalSupply,
  getAvgAPR,
}
