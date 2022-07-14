const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../../lib/web3')
const jarvisRewardContract = require('../../../lib/web3/contracts/jarvis-rewards-v2/contract.json')
const {
  getPoolInfo,
  getRewardPerBlock,
  totalAllocPoints,
  getRewardToken,
  getEndBlock,
} = require('../../../lib/web3/contracts/jarvis-rewards-v2/methods')

const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getApy = async (poolId, rewardPool, underlying, reduction) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const jarvisInstance = new web3MATIC.eth.Contract(jarvisRewardContract.abi, rewardPool)

  const poolInfo = await getPoolInfo(poolId, jarvisInstance)

  const blocksPerYear = new BigNumber(13720402.6087)

  const tokenInstance = new web3MATIC.eth.Contract(abi, poolInfo.lpToken)
  const totalSupply = new BigNumber(await getBalance(rewardPool, tokenInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )

  const rewardToken = await getRewardToken(jarvisInstance)
  const rewardPriceInUsd = await getTokenPrice(rewardToken)
  const rewardPerBlock = new BigNumber(await getRewardPerBlock(jarvisInstance))
    .times(poolInfo.allocPoint)
    .div(await totalAllocPoints(jarvisInstance))
    .div(1e18)
  const rewardPerYear = rewardPerBlock.times(blocksPerYear)

  const lpTokenPrice = await getTokenPrice(underlying)
  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(rewardPriceInUsd).times(rewardPerYear).div(totalSupplyInUsd)
  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }
  let latestBlock = await web3MATIC.eth.getBlockNumber()
  let endBlock = await getEndBlock(jarvisInstance)
  if (latestBlock > endBlock) return '0'

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
