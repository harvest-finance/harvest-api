const { countFunctionCall } = require('../..')

const getGaugeRelativeWeight = (gauge, instance) =>
  countFunctionCall(instance.methods.gauge_relative_weight(gauge).call())

module.exports = {
  getGaugeRelativeWeight,
}
