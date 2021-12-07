const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')
const jarvisRewardContract = require('../../../lib/web3/contracts/jarvis-rewards/contract.json')
const { getPoolInfo } = require('../../../lib/web3/contracts/jarvis-rewards/methods')

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

  const tokenInstance = new web3MATIC.eth.Contract(abi, poolInfo.stakeToken)
  const totalSupply = new BigNumber(
    await getBalance(jarvisRewardContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const aurPriceInUsd = await getTokenPrice(tokenAddresses.AURFEB22)
  const aurPerBlock = new BigNumber(poolInfo.rewardPerBlocks[0]).div(1e18)
  const aurPerYear = aurPerBlock.times(blocksPerYear)

  const lpTokenPrice = await getTokenPrice(underlying)
  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(aurPriceInUsd).times(aurPerYear).div(totalSupplyInUsd)
  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
