const BigNumber = require('bignumber.js')
const { Cache } = require('../../../lib/db/models/cache')
const { web3 } = require('../../../lib/web3')
const { getUIData } = require('../../../lib/data')
const { getTokenPrice } = require('../../../prices')
const { token: tokenContractData } = require('../../../lib/web3/contracts')

const { UI_DATA_FILES, PROFIT_SHARING_POOL_ID, DB_CACHE_IDS } = require('../../../lib/constants')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { find, get } = require('lodash')
const museMasterContract = require('../../../lib/web3/contracts/muse-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoMuse,
} = require('../../../lib/web3/contracts/muse-masterchef/methods')
const { cache } = require('../../../lib/cache')

const getApy = async (poolId, lpToken, buybackFraction) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const { abi: museMasterAbi, address: museMasterAddress } = museMasterContract
  const {
    methods: { getBalance },
    contract: { abi: tokenAbi },
  } = tokenContractData

  const museInstance = new web3.eth.Contract(museMasterAbi, museMasterAddress.mainnet)
  const poolInfo = await getPoolInfoMuse(poolId, museInstance)

  const tokenInstance = new web3.eth.Contract(tokenAbi, poolInfo.lpToken)
  const totalStaked = new BigNumber(
    await getBalance(museMasterAddress.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const dbData = await Cache.find({
    type: { $in: [DB_CACHE_IDS.STATS, DB_CACHE_IDS.POOLS] },
  })

  const fetchedStats = dbData.find(result => result.type === DB_CACHE_IDS.STATS)
  const fetchedPools = dbData.find(result => result.type === DB_CACHE_IDS.POOLS)

  let deposit = new BigNumber(1),
    iFARMDeposit = new BigNumber(0),
    thisDayReward = new BigNumber(0),
    iFARMAPR = get(fetchedStats, 'data.tokenStats.historicalAverageProfitSharingAPY', 0)

  if (!iFARMAPR) {
    iFARMAPR = get(
      find(get(fetchedPools, 'data.eth', []), pool => pool && pool.id === 'profit-sharing-farm'),
      'rewardAPY',
      get(cache.get(`poolRewardApy${PROFIT_SHARING_POOL_ID}`), 'apy', 0),
    )
  }

  const lpTokenPriceInUSD = await getTokenPrice(tokens[lpToken].tokenAddress)
  const iFARMPriceInUSD = await getTokenPrice(tokenAddresses.iFARM)
  const musePriceInUSD = await getTokenPrice(tokenAddresses.MUSE)

  const museReward = new BigNumber(!Number(poolId) ? 250 : 31.25)
  const museRewardInLp = museReward.times(musePriceInUSD).div(lpTokenPriceInUSD)

  const dailyPercentageFromiFARM = Math.pow(Number(iFARMAPR) / 100 + 1, 1 / 365) - 1
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
