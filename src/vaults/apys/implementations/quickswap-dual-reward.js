const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')

const { getUIData } = require('../../../lib/data')
const { UI_DATA_FILES } = require('../../../lib/constants')
const { getTokenPrice } = require('../../../prices')

const { quickswapDualReward: poolContractInfo } = require('../../../lib/web3/contracts')

const getApy = async (
  poolAddress,
  lpTokenSymbol,
  rewardTokenASymbol,
  rewardTokenBSymbol,
  factor,
) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const lpTokenData = tokens[lpTokenSymbol]
  const rewardAData = tokens[rewardTokenASymbol]
  const rewardBData = tokens[rewardTokenBSymbol]
  const web3Instance = getWeb3(tokens[lpTokenSymbol].chain)
  const {
    methods: { periodFinish, rewardRateA, rewardRateB, totalSupply },
  } = poolContractInfo

  const poolInstance = new web3Instance.eth.Contract(poolContractInfo.contract.abi, poolAddress)

  const now = Date.now() / 1000
  const poolPeriodFinish = await periodFinish(poolInstance)
  if (now > poolPeriodFinish) {
    return '0'
  }

  const poolRewardRateA = await rewardRateA(poolInstance)
  const poolRewardRateB = await rewardRateB(poolInstance)
  const weeklyRewardA = new BigNumber(poolRewardRateA)
    .dividedBy(10 ** rewardAData.decimals)
    .times(604800)
  const weeklyRewardB = new BigNumber(poolRewardRateB)
    .dividedBy(10 ** rewardBData.decimals)
    .times(604800)
  const priceA = await getTokenPrice(rewardTokenASymbol)
  const priceB = await getTokenPrice(rewardTokenBSymbol)

  let poolTotalSupply = await totalSupply(poolInstance)
  poolTotalSupply = new BigNumber(poolTotalSupply).dividedBy(10 ** lpTokenData.decimals)
  const priceLP = await getTokenPrice(lpTokenSymbol)

  const apr = new BigNumber(priceA)
    .times(weeklyRewardA)
    .plus(new BigNumber(priceB).times(weeklyRewardB))
    .times(52)
    .div(poolTotalSupply)
    .div(priceLP)
    .times(100)
    .times(factor)

  return apr.toFixed()
}

module.exports = {
  getApy,
}
