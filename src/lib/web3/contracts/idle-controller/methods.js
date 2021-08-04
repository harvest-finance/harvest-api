const { countFunctionCall } = require('../..')

const idleSpeeds = (target, instance) =>
  countFunctionCall(instance.methods.idleSpeeds(target).call())

module.exports = {
  idleSpeeds,
}
