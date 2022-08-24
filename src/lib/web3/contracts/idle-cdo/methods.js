const { countFunctionCall } = require('../..')

const priceAA = instance => countFunctionCall(instance.methods.priceAA().call())

module.exports = {
  priceAA,
}
