const { countFunctionCall } = require('../..')

const rewardContract = instance => countFunctionCall(instance.methods.reward_contract().call())
const totalSupply = instance => countFunctionCall(instance.methods.totalSupply().call())

module.exports = {
  rewardContract,
  totalSupply,
}
