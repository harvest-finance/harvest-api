const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')
const { balGauge } = require('../../../lib/web3/contracts')

const getApy = async (tokenSymbol, gaugeAddress, factor) => {
  const web3Polygon = getWeb3(CHAIN_TYPES.MATIC)
  const MAX_REWARD_TOKENS = 8
  const ZeroAddress = '0x0000000000000000000000000000000000000000'
  const {
    contract: { abi: balGaugeAbi },
    methods: balGaugeMethods,
  } = balGauge

  const balGaugeInstance = new web3Polygon.eth.Contract(balGaugeAbi, gaugeAddress)

  let rewardTokens = []

  for (let i = 0; i < MAX_REWARD_TOKENS; i++) {
    rewardTokens[i] = await balGaugeMethods.getRewardToken(i, balGaugeInstance)
  }

  const totalSupply = new BigNumber(
    await balGaugeMethods.getTotalSupply(balGaugeInstance),
  ).dividedBy(new BigNumber(1e18))
  const lpTokenPrice = new BigNumber(await getTokenPrice(tokenSymbol, CHAIN_TYPES.MATIC))

  let totalRewardPerWeekUsd = new BigNumber(0)
  for (let i = 0; i < rewardTokens.length; i++) {
    const rewardToken = rewardTokens[i]
    if (rewardToken !== ZeroAddress) {
      const rewardTokenMeta = await balGaugeMethods.getRewardData(rewardToken, balGaugeInstance)
      if (Date.now() / 1000 > parseInt(rewardTokenMeta.period_finish)) {
        continue
      }
      const inflationRate = new BigNumber(rewardTokenMeta.rate).dividedBy(new BigNumber(1e18))
      const tokenPerWeek = inflationRate.times(7).times(86400)

      const shareForOneBpt = new BigNumber(1).dividedBy(totalSupply).plus(1)
      const rewardPerWeek = shareForOneBpt.times(tokenPerWeek)

      const rewardTokenInUsd = await getTokenPrice(rewardToken, CHAIN_TYPES.MATIC)
      const rewardPerWeekUsd = rewardPerWeek.times(rewardTokenInUsd)
      totalRewardPerWeekUsd = totalRewardPerWeekUsd.plus(rewardPerWeekUsd)
    }
  }
  const apy = totalRewardPerWeekUsd
    .times(52)
    .dividedBy(lpTokenPrice)
    .dividedBy(totalSupply)
    .multipliedBy(100)
  const result = apy.times(factor).toFixed(2, 1)

  return result
}

module.exports = {
  getApy,
}
