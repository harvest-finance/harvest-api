const { countFunctionCall } = require('../..')

const getUnderlyingBalanceWithInvestment = instance =>
  countFunctionCall(instance.methods.underlyingBalanceWithInvestment().call())

const getUnderlyingBalanceWithInvestmentForHolder = (userAddress, instance) =>
  countFunctionCall(instance.methods.underlyingBalanceWithInvestmentForHolder(userAddress).call())

const getPricePerFullShare = instance =>
  countFunctionCall(instance.methods.getPricePerFullShare().call())

const getUnderlyingToken = instance => countFunctionCall(instance.methods.underlying().call())

const decimals = instance => countFunctionCall(instance.methods.decimals().call())

const getStrategy = instance => countFunctionCall(instance.methods.strategy().call())

const withdraw = (amount, address, instance) =>
  countFunctionCall(instance.methods.withdraw(amount).send({ from: address }))

const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  getUnderlyingBalanceWithInvestment,
  getUnderlyingBalanceWithInvestmentForHolder,
  getPricePerFullShare,
  getUnderlyingToken,
  decimals,
  withdraw,
  getStrategy,
  getTotalSupply,
}
