const { countFunctionCall } = require('../..')

const getAmountsOut = (amountsIn, path, instance) =>
  countFunctionCall(instance.methods.getAmountsOut(amountsIn, path).call())

module.exports = { getAmountsOut }
