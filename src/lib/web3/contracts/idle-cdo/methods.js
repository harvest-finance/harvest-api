const { countFunctionCall } = require('../..')

const priceAA = instance => countFunctionCall(instance.methods.priceAA().call())

const getApr = (tranche, instance) => countFunctionCall(instance.methods.getApr(tranche).call())

const AATranche = instance => countFunctionCall(instance.methods.AATranche().call())

module.exports = {
  getApr,
  priceAA,
  AATranche,
}
