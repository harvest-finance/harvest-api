const BigNumber = require('bignumber.js')
const {
  pool: regularPoolContract,
  potPool: potPoolContract,
  amplifier: amplifierContract,
  token: tokenContract,
} = require('../lib/web3/contracts')
const { getWeb3, getCallCount, resetCallCount } = require('../lib/web3')
const { get, find, omit } = require('lodash')
const {
  DB_CACHE_IDS,
  WEB3_CALL_COUNT_STATS_KEY,
  DEBUG_MODE,
  PROFIT_SHARING_POOL_ID,
  POOL_TYPES,
} = require('../lib/constants')
const { cache } = require('../lib/cache')
const addresses = require('../lib/data/addresses.json')
const { getTradingApy } = require('../vaults/trading-apys')

const { Cache } = require('../lib/db/models/cache')
const { getPoolStatsPerType, getIncentivePoolStats } = require('./utils')
const { getTokenPrice } = require('../prices')

const fetchAndExpandPool = async pool => {
  if (DEBUG_MODE) {
    resetCallCount()
  }

  const web3Instance = getWeb3(pool.chain)

  try {
    console.log('Getting pool data for: ', pool.id)
    const isSingleRewardPool = pool.rewardTokens.length === 1

    const poolContract = isSingleRewardPool ? regularPoolContract : potPoolContract
    const poolInstance = new web3Instance.eth.Contract(
      poolContract.contract.abi,
      pool.contractAddress,
    )

    const lpAddress = await poolContract.methods.lpToken(poolInstance)
    const lpTokenData = await fetchLpToken(lpAddress, pool.chain)

    const dbData = await Cache.find({
      type: { $in: [DB_CACHE_IDS.STATS, DB_CACHE_IDS.POOLS] },
    })

    const fetchedStats = dbData.find(result => result.type === DB_CACHE_IDS.STATS)
    const fetchedPools = dbData.find(result => result.type === DB_CACHE_IDS.POOLS)

    let poolStats,
      amountToStakeForBoost,
      boostedRewardAPY,
      profitShareAPY = get(fetchedStats, 'data.tokenStats.historicalAverageProfitSharingAPY', 0)

    if (!profitShareAPY) {
      profitShareAPY = get(
        find(get(fetchedPools, 'data.eth', []), pool => pool && pool.id === 'profit-sharing-farm'),
        'rewardAPY',
        get(cache.get(`poolRewardApy${PROFIT_SHARING_POOL_ID}`), 'apy', 0),
      )
    }

    const tradingApy = pool.tradingApyOveride || (await getTradingApy(pool))

    if (pool.rewardAPYOveride) {
      poolStats = {
        apr: pool.rewardAPYOveride,
        apy: pool.rewardAPYOveride,
        totalSupply: await poolContract.methods.totalSupply(poolInstance),
        finishTime: await poolContract.methods.periodFinish(poolInstance),
      }
    } else {
      poolStats = await getPoolStatsPerType(
        pool,
        {
          ...poolContract,
          instance: poolInstance,
        },
        lpTokenData,
      )

      const hasIFarmReward = pool.rewardTokens.includes(addresses.iFARM)
      const hasAmpliFARMReward = pool.rewardTokens.includes(addresses.ampliFARM)

      if (hasIFarmReward) {
        boostedRewardAPY = new BigNumber(get(poolStats, 'apy[0]', 0))
          .times(new BigNumber(profitShareAPY).plus(100))
          .dividedBy(100)
          .toFixed(2)
      } else if (hasAmpliFARMReward) {
        const bFarmTokenInstance = new web3Instance.eth.Contract(
          tokenContract.contract.abi,
          addresses.BSC.bFARM,
        )

        const amplifierInstance = new web3Instance.eth.Contract(
          amplifierContract.contract.abi,
          addresses.BSC.AmpliFARM.tokenAddress,
        )

        const totalSupply = await tokenContract.methods.getTotalSupply(amplifierInstance)

        const amplifierAmount = new BigNumber(
          await tokenContract.methods.getBalance(
            addresses.BSC.AmpliFARM.amplifier,
            bFarmTokenInstance,
          ),
        ).toFixed()

        amountToStakeForBoost = new BigNumber(amplifierAmount).dividedBy(totalSupply).toFixed()

        const now = Date.now() / 1000
        const fetchedPeriodFinish = await poolContract.methods.periodFinishForToken(
          addresses.ampliFARM,
          poolInstance,
        )

        const fetchedRewardRate = new BigNumber(
          await potPoolContract.methods.rewardRateForToken(addresses.ampliFARM, poolInstance),
        )

        const weeklyAmplifarm = new BigNumber(
          fetchedPeriodFinish < now ? 0 : fetchedRewardRate.dividedBy(1e18).times(604800).toFixed(),
        )

        const additionalbFarm = new BigNumber(amountToStakeForBoost)
          .times(weeklyAmplifarm)
          .toFixed()

        // we can use the POOL_TYPES.INCENTIVE_BUYBACK type to get what the APY would be with the additional bFARM
        const poolStatsIfBFarmWasTheReward = await getPoolStatsPerType(
          {
            ...pool,
            type: POOL_TYPES.INCENTIVE_BUYBACK,
            rewardTokens: [addresses.BSC.bFARM],
          },
          {
            ...poolContract,
            instance: poolInstance,
          },
          lpTokenData,
          additionalbFarm,
          true,
        )

        boostedRewardAPY = new BigNumber(get(poolStatsIfBFarmWasTheReward, 'apy[0]', 0))
          .plus(get(poolStatsIfBFarmWasTheReward, 'apy[0]', 0))
          .toFixed(2)
      } else {
        boostedRewardAPY = null
      }
    }

    let totalValueLocked = new BigNumber(poolStats.totalSupply)
      .multipliedBy(lpTokenData.price)
      .dividedBy(new BigNumber(10).exponentiatedBy(lpTokenData.decimals))
      .toFixed()

    if (pool.oldPoolContractAddress) {
      // to account for tvl while migrating
      const oldPoolInstance = new web3Instance.eth.Contract(
        poolContract.contract.abi,
        pool.oldPoolContractAddress,
      )

      const oldPoolTotalSupply = await poolContract.methods.totalSupply(oldPoolInstance)
      const oldPoolTvl = new BigNumber(oldPoolTotalSupply)
        .multipliedBy(lpTokenData.price)
        .dividedBy(new BigNumber(10).exponentiatedBy(lpTokenData.decimals))
        .toFixed()

      totalValueLocked = new BigNumber(totalValueLocked).plus(oldPoolTvl).toFixed()
    }

    if (DEBUG_MODE) {
      const currentCache = cache.get(WEB3_CALL_COUNT_STATS_KEY)
      cache.set(WEB3_CALL_COUNT_STATS_KEY, {
        ...currentCache,
        pools: [...currentCache.pools, { poolId: pool.id, callCount: getCallCount() }],
      })
      resetCallCount()
    }

    return {
      ...omit(pool, ['tradingApyFunction']),
      lpTokenData,
      amountToStakeForBoost,
      boostedRewardAPY,
      rewardAPY: poolStats.apy,
      rewardAPR: poolStats.apr,
      rewardPerToken: poolStats.rewardRate,
      totalSupply: poolStats.totalSupply,
      finishTime: poolStats.periodFinish,
      totalValueLocked,
      tradingApy,
    }
  } catch (err) {
    console.error(`Failed to get pool data for: ${pool.id}`, err)
  }
}

const fetchLpToken = async (lpAddress, chainId) => {
  const web3Instance = getWeb3(chainId)

  const lpTokenInstance = new web3Instance.eth.Contract(tokenContract.contract.abi, lpAddress)
  const lpDecimals = await tokenContract.methods.getDecimals(lpTokenInstance)
  const lpSymbol = await tokenContract.methods.getSymbol(lpTokenInstance)
  const lpTokenPrice = await getTokenPrice(lpAddress, chainId)

  const result = {
    address: lpAddress,
    decimals: lpDecimals,
    symbol: lpSymbol,
    price: lpTokenPrice,
  }

  if (lpSymbol === 'UNI-V2') {
    // only getting liquidity for uniswap LP tokens
    result.liquidity = new BigNumber(lpTokenPrice)
      .multipliedBy(await tokenContract.methods.getTotalSupply(lpTokenInstance))
      .dividedBy(new BigNumber(10).exponentiatedBy(lpDecimals))
      .toString(10)
  }

  return result
}

const getPoolsData = async poolToFetch => Promise.all(poolToFetch.map(fetchAndExpandPool))

module.exports = {
  getPoolsData,
  getPoolStatsPerType,
  getIncentivePoolStats,
  fetchAndExpandPool,
}
