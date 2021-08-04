const { countFunctionCall } = require('../..')

const getPastEvents = (eventType, instance) =>
  countFunctionCall(instance.methods.getPastEvents(eventType).call())

module.exports = {
  getPastEvents,
}
