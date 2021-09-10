const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const universeStakingContract = require('../../../lib/web3/contracts/universe-staking/contract.json')
const {
  getEpochPoolSize,
  getCurrentEpoch,
} = require('../../../lib/web3/contracts/universe-staking/methods')
const { getTokenPrice } = require('../../../prices')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice

const getApy = async (tokenAddress, weeklyXYZ, reduction, firstToken, secondToken) => {
  const { abi: universeStakingAbi, address: universeStakingAddress } = universeStakingContract

  const universeStakingInstance = new web3.eth.Contract(
    universeStakingAbi,
    universeStakingAddress.mainnet,
  )
  const currentEpoch = await getCurrentEpoch(universeStakingInstance)
  const currentPoolSize = new BigNumber(
    await getEpochPoolSize(tokenAddress, currentEpoch, universeStakingInstance),
  ).div(new BigNumber(10).pow(18))

  const xyzPrice = await getTokenPrice(tokenAddresses.XYZ)
  let tokenPrice

  if (firstToken && secondToken) {
    tokenPrice = await getLPTokenPrice(tokenAddress, firstToken, secondToken)
  } else {
    tokenPrice = await getTokenPrice(tokenAddress)
  }

  const totalSupplyInUSD = currentPoolSize.multipliedBy(tokenPrice)

  let apy = new BigNumber(weeklyXYZ).times(xyzPrice).times(52).div(totalSupplyInUSD)

  if (reduction) {
    apy = apy.times(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
