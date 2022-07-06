const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')
const { balGauge } = require('../../../lib/web3/contracts')
const tokenAddresses = require('../../../lib/data/addresses.json')

const getApy = async (tokenSymbol, gaugeAddress, swapAddress, factor, chain = CHAIN_TYPES.ETH) => {
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

  rewardTokens.filter(token => token !== ZeroAddress)

  const totalSupply = new BigNumber(
    await balGaugeMethods.getTotalSupply(balGaugeInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))
  const lpTokenPrice = new BigNumber(await getTokenPrice(tokenSymbol, chain))

  let apy = new BigNumber('0')
  let rewardToken = rewardTokens[0]
  if (rewardToken !== ZeroAddress) {
    const rewardTokenMeta = await balGaugeMethods.getRewardData(rewardToken, balGaugeInstance)
    const inflationRate = new BigNumber(rewardTokenMeta.rate).dividedBy(
      new BigNumber(10).exponentiatedBy(18),
    )
    if (Date.now() / 1000 > parseInt(rewardTokenMeta.period_finish)) {
      return 0
    }
    const tokenPayable = inflationRate.times(7).times(86400).times(new BigNumber(1))

    let weeklyReward
    const shareForOneBpt = new BigNumber(1).dividedBy(totalSupply).plus(new BigNumber(1))
    weeklyReward = shareForOneBpt.times(tokenPayable)

    const rewardTokenInUsd = await getTokenPrice(tokenAddresses.BAL)
    const yearlyreward = weeklyReward.times('1').times(52).times(rewardTokenInUsd)

    apy = yearlyreward.dividedBy(lpTokenPrice).dividedBy(totalSupply).multipliedBy(100)
    const result = apy.multipliedBy(factor).toFixed(2, 1)

    return result
  }
}

module.exports = {
  getApy,
}
