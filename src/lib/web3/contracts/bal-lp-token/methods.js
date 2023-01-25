const { countFunctionCall } = require('../..')

const getActualSupply = instance => countFunctionCall(instance.methods.getActualSupply().call())

module.exports = {
  getActualSupply,
}
