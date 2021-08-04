const { countFunctionCall } = require('../..')

const getVirtualPrice = instance => countFunctionCall(instance.methods.get_virtual_price().call())

module.exports = {
  getVirtualPrice,
}
