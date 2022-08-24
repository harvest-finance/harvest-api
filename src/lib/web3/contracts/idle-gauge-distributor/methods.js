const { countFunctionCall } = require('../..')

const rate = instance => countFunctionCall(instance.methods.rate().call())

module.exports = {
  rate,
}
