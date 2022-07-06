const { countFunctionCall } = require('../..')

const getNTokenPresentValueUnderlyingDenominated = (currencyId, instance) =>
  countFunctionCall(instance.methods.nTokenPresentValueUnderlyingDenominated(currencyId).call())

const getNTokenGetClaimableIncentives = (account, blockTime, instance) =>
  countFunctionCall(instance.methods.nTokenGetClaimableIncentives(account, blockTime).call())

module.exports = { getNTokenPresentValueUnderlyingDenominated, getNTokenGetClaimableIncentives }
