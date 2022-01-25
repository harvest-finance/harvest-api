const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const looksFeeShare = require('../../../lib/web3/contracts/looks-feesharing/contract.json')
const {
  getRewardPerBlock,
  getRewardToken,
  getStakedToken,
  getTotalShares,
  getSharePrice,
} = require('../../../lib/web3/contracts/looks-feesharing/methods')
const { getTokenPrice } = require('../../../prices')

const getApy = async (rewardPool, reduction) => {
  const rewardPoolInstance = new web3.eth.Contract(looksFeeShare.abi, rewardPool)

  let rewardPerBlock = new BigNumber(await getRewardPerBlock(rewardPoolInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  let blocksPerYear = new BigNumber(2336000)
  let stakedToken = await getStakedToken(rewardPoolInstance)
  let rewardToken = await getRewardToken(rewardPoolInstance)

  const totalShares = new BigNumber(await getTotalShares(rewardPoolInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  const sharePrice = new BigNumber(await getSharePrice(rewardPoolInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  const totalSupply = totalShares.times(sharePrice)

  const stakedPrice = await getTokenPrice(stakedToken)
  const rewardPrice = await getTokenPrice(rewardToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(stakedPrice)
  const rewardInUsdPerYear = new BigNumber(rewardPrice).times(rewardPerBlock).times(blocksPerYear)

  let apy = rewardInUsdPerYear.div(totalSupplyInUsd)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
