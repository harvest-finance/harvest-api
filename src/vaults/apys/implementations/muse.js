const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const { getUIData } = require('../../../lib/data')
const { getIncentivePoolStats } = require('../../../pools')
const { getTokenPrice } = require('../../../prices')
const { pool: poolContractInfo, token: tokenContractData } = require('../../../lib/web3/contracts')

const { UI_DATA_FILES } = require('../../../lib/constants')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { find } = require('lodash')
const museMasterContract = require('../../../lib/web3/contracts/muse-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoMuse,
} = require('../../../lib/web3/contracts/muse-masterchef/methods')

const getApy = async (poolId, lpToken, buybackFraction) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const pools = await getUIData(UI_DATA_FILES.POOLS)
  const { abi: museMasterAbi, address: museMasterAddress } = museMasterContract
  const {
    methods: { getBalance },
    contract: { abi: tokenAbi },
  } = tokenContractData
  const {
    contract: { abi: poolAbi },
  } = poolContractInfo

  const museInstance = new web3.eth.Contract(museMasterAbi, museMasterAddress.mainnet)
  const poolInfo = await getPoolInfoMuse(poolId, museInstance)

  const tokenInstance = new web3.eth.Contract(tokenAbi, poolInfo.lpToken)
  const totalStaked = new BigNumber(
    await getBalance(museMasterAddress.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  let deposit = new BigNumber(1),
    iFARMDeposit = new BigNumber(0),
    thisDayReward = new BigNumber(0)

  const lpTokenPriceInUSD = await getTokenPrice(tokens[lpToken].tokenAddress)
  const iFARMPriceInUSD = await getTokenPrice(tokenAddresses.iFARM)
  const musePriceInUSD = await getTokenPrice(tokenAddresses.MUSE)

  const museReward = new BigNumber(!Number(poolId) ? 250 : 31.25)
  const museRewardInLp = museReward.times(musePriceInUSD).div(lpTokenPriceInUSD)

  const iFARMPool = find(pools, pool => pool.id === 'profit-sharing-farm')
  const iFARMLPTokenData = { address: tokenAddresses.FARM, decimals: 18 }

  const iFARMAPR = await getIncentivePoolStats(
    iFARMPool,
    {
      ...poolContractInfo,
      instance: new web3.eth.Contract(poolAbi, iFARMPool.contractAddress),
    },
    iFARMLPTokenData,
    0,
    undefined,
    iFARMPool.rewardTokens[0],
  ).apr

  const dailyPercentageFromiFARM = Math.pow(Number(iFARMAPR / 100) + 1, 1 / 365) - 1
  const dailyPercentageFromMuseRewardsInLp = museRewardInLp.div(totalStaked)

  for (let day = 0; day < 365; day++) {
    // apply daily rewards
    thisDayReward = deposit.times(dailyPercentageFromMuseRewardsInLp)
    thisDayReward = new BigNumber(0.7).times(thisDayReward) // 30% goes to profit share so we are taking it away

    const depositIncreaseInLp = thisDayReward.times(new BigNumber(1).minus(buybackFraction))
    deposit = deposit.plus(depositIncreaseInLp) // half of the remainder is converted to the LP token and added to the deposit

    iFARMDeposit = iFARMDeposit.plus(iFARMDeposit.times(dailyPercentageFromiFARM)) // iFARM accumulates its daily profit

    const rewardToIFarmInLp = thisDayReward.minus(depositIncreaseInLp)
    const iFARMDepositIncrease = rewardToIFarmInLp
      .times(lpTokenPriceInUSD)
      .dividedBy(iFARMPriceInUSD)
    iFARMDeposit = iFARMDeposit.plus(iFARMDepositIncrease) // the rest of the MUSE reward is added to iFARM deposit
  }

  const iFARMDepositInUSD = iFARMDeposit.times(iFARMPriceInUSD)
  const apy = new BigNumber(iFARMDepositInUSD).dividedBy(lpTokenPriceInUSD).plus(deposit) // convert iFARM back to the units of deposit

  return apy.isNaN() ? '0' : apy.times(100).toFixed(2)
}

module.exports = {
  getApy,
}
