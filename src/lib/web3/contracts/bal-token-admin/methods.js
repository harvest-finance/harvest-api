const { countFunctionCall } = require('../..')

const getRate = instance => countFunctionCall(instance.methods.rate().call())

module.exports = {
  getRate,
}
