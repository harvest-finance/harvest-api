const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const jarvisRewardContract = require('../../../lib/web3/contracts/jarvis-rewards-v2/contract.json')
const {
  getPoolInfo,
  rewardPerBlock,
  totalAllocPoints,
} = require('../../../lib/web3/contracts/jarvis-rewards-v2/methods')

const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getApy = async (poolId, underlying, reduction) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const jarvisInstance = new web3MATIC.eth.Contract(
    jarvisRewardContract.abi,
    jarvisRewardContract.address.mainnet,
  )

  const poolInfo = await getPoolInfo(poolId, jarvisInstance)

  const blocksPerYear = new BigNumber(13720402.6087)

  const tokenInstance = new web3MATIC.eth.Contract(abi, poolInfo.lpToken)
  const totalSupply = new BigNumber(
    await getBalance(jarvisRewardContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const denPriceInUsd = await getTokenPrice(tokenAddresses.DEN)
  const denPerBlock = new BigNumber(await rewardPerBlock(jarvisInstance))
    .times(poolInfo.allocPoint)
    .div(await totalAllocPoints(jarvisInstance))
    .div(1e18)
  const denPerYear = denPerBlock.times(blocksPerYear)

  const lpTokenPrice = await getTokenPrice(underlying)
  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(denPriceInUsd).times(denPerYear).div(totalSupplyInUsd)
  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
