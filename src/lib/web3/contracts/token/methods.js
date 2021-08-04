const { countFunctionCall } = require('../..')

const getBalance = (address, instance) =>
  countFunctionCall(instance.methods.balanceOf(address).call())

const getApprovedAmount = (address, contractAddress, instance) =>
  countFunctionCall(instance.methods.allowance(address, contractAddress).call())

const getDecimals = instance => countFunctionCall(instance.methods.decimals().call())

const getSymbol = instance => countFunctionCall(instance.methods.symbol().call())

const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  getBalance,
  getApprovedAmount,
  getDecimals,
  getSymbol,
  getTotalSupply,
}
