const { countFunctionCall } = require('../..')

const getWorkingSupply = instance => countFunctionCall(instance.methods.working_supply().call())
const getWorkingBalance = (addr, instance) =>
  countFunctionCall(instance.methods.working_balances(addr).call())
const balanceOf = (addr, instance) => countFunctionCall(instance.methods.balanceOf(addr).call())
const getTotalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  getWorkingSupply,
  getTotalSupply,
  getWorkingBalance,
  balanceOf,
}
