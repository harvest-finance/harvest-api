const { countFunctionCall } = require('../..')

const gaugeRelativeWeight = (gauge, instance) =>
  countFunctionCall(instance.methods.gauge_relative_weight(gauge).call())

module.exports = {
  gaugeRelativeWeight,
}
