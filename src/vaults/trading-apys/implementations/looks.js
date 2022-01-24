const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const looksFeeShare = require('../../../lib/web3/contracts/looks-feesharing/contract.json')
const {
  getStakedToken,
  getTotalShares,
  getSharePrice,
  getTokenDistributor,
} = require('../../../lib/web3/contracts/looks-feesharing/methods')
const looksDistributor = require('../../../lib/web3/contracts/looks-distributor/contract.json')
const {
  getRewardPerBlockForStaking,
} = require('../../../lib/web3/contracts/looks-distributor/methods')
const { getTokenPrice } = require('../../../prices')
const { getDailyCompound } = require('../../../lib/utils.js')

const getTradingApy = async rewardPool => {
  const rewardPoolInstance = new web3.eth.Contract(looksFeeShare.abi, rewardPool)
  const distributorAddress = await getTokenDistributor(rewardPoolInstance)
  const distributionInstance = new web3.eth.Contract(looksDistributor.abi, distributorAddress)

  let rewardPerBlock = new BigNumber(
    await getRewardPerBlockForStaking(distributionInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))
  let blocksPerYear = new BigNumber(2336000)
  let stakedToken = await getStakedToken(rewardPoolInstance)

  const totalShares = new BigNumber(await getTotalShares(rewardPoolInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  const sharePrice = new BigNumber(await getSharePrice(rewardPoolInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  const totalSupply = totalShares.times(sharePrice)

  const stakedPrice = await getTokenPrice(stakedToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(stakedPrice)
  const rewardInUsdPerYear = new BigNumber(stakedPrice).times(rewardPerBlock).times(blocksPerYear)

  const apr = rewardInUsdPerYear.div(totalSupplyInUsd).times(100)
  const apy = getDailyCompound(apr)

  return apy
}

module.exports = {
  getTradingApy,
}
