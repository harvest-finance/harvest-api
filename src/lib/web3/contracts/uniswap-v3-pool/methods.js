const { countFunctionCall } = require('../..')

const getSlot = instance => countFunctionCall(instance.methods.slot0().call())
const getPosition = (positionKey, instance) =>
  countFunctionCall(instance.methods.positions(positionKey).call())

module.exports = {
  getSlot,
  getPosition,
}
