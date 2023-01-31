const { countFunctionCall } = require('../..')

const getVirtualSupply = instance => countFunctionCall(instance.methods.getVirtualSupply().call())

module.exports = {
  getVirtualSupply,
}
