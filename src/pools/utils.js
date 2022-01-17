const { cache } = require('../lib/cache')
const { size, isUndefined } = require('lodash')
const { POOL_TYPES, CHAIN_TYPES, GENERAL_CACHE_TTL } = require('../lib/constants')
const { forEach } = require('promised-loops')
const addresses = require('../lib/data/addresses.json')
const { default: BigNumber } = require('bignumber.js')
const { getWeeklyCompound, getDailyCompound } = require('../lib/utils')
const { getTokenPrice } = require('../prices')
const tokenAddresses = require('../lib/data/addresses.json')
const { web3Socket, web3 } = require('../lib/web3')
const { pool: poolContractInfo, potPool: potPoolContractInfo } = require('../lib/web3/contracts')

const getIncentivePoolStats = async (
  pool,
  poolContractData,
  lpTokenData,
  weeklyRewardRateOverride, // used to overwrite the reward amount per week (currently used for ampliFARM and INCENTIVE_BUYBACK pools)
  basisPoolId,
  rewardTokenAddress,
  isPotPool,
) => {
  const {
    methods: {
      periodFinish,
      rewardRate,
      rewardRateForToken,
      periodFinishForToken,
      totalSupply,
      rewardRatePerPool,
    },
    instance,
  } = poolContractData

  let apr, fetchedTotalSupply, stakingTokenPrice, adjsutedTotalSupply

  const now = Date.now() / 1000
  const fetchedPeriodFinish = isPotPool
    ? await periodFinishForToken(rewardTokenAddress, instance)
    : await periodFinish(instance)

  const fetchedRewardRate = isPotPool
    ? new BigNumber(await rewardRateForToken(rewardTokenAddress, instance))
    : !isUndefined(basisPoolId)
    ? new BigNumber(await rewardRatePerPool(basisPoolId, instance))
    : new BigNumber(await rewardRate(instance))

  const fetchedTokenPrice = await getTokenPrice(rewardTokenAddress, pool.chain)
  const pricePerToken = new BigNumber(fetchedTokenPrice)

  const weeklyRewardRate = !isUndefined(weeklyRewardRateOverride)
    ? new BigNumber(weeklyRewardRateOverride)
    : new BigNumber(
        fetchedPeriodFinish < now ? 0 : fetchedRewardRate.dividedBy(1e18).times(604800).toFixed(),
      )

  stakingTokenPrice = lpTokenData.price

  if (lpTokenData.price === undefined) {
    stakingTokenPrice = await getTokenPrice(lpTokenData.address, pool.chain)
  }

  fetchedTotalSupply = new BigNumber(
    !isUndefined(basisPoolId)
      ? await totalSupply(basisPoolId, instance)
      : await totalSupply(instance),
  )

  // Set to one in the case of zero to avoid division by zero
  if (fetchedTotalSupply.eq(0)) {
    adjsutedTotalSupply = new BigNumber(1)
  } else {
    adjsutedTotalSupply = fetchedTotalSupply
  }

  adjsutedTotalSupply = adjsutedTotalSupply.dividedBy(
    new BigNumber(10).exponentiatedBy(lpTokenData.decimals),
  )

  apr = pricePerToken
    .times(weeklyRewardRate)
    .times(new BigNumber(52))
    .dividedBy(adjsutedTotalSupply)
    .dividedBy(stakingTokenPrice)

  if (pool.rewardMultiplier) {
    apr = apr.multipliedBy(pool.rewardMultiplier)
  }

  return {
    apr: apr.isNaN() ? '0' : apr.multipliedBy(100).toFixed(),
    totalSupply: fetchedTotalSupply.toFixed(),
    lpTokenPrice: stakingTokenPrice,
    rewardRate: fetchedRewardRate.toFixed(),
    periodFinish: fetchedPeriodFinish,
  }
}

const getPoolStatsPerType = async (pool, poolContractData, lpTokenData, weeklyReward, fresh) => {
  let cachedStats

  if (!fresh) {
    cachedStats = cache.get(`poolRewardApy${pool.id}`)
  }

  if (cachedStats) {
    return cachedStats
  }

  const allPoolStats = []

  for (let rewardTokenAddress of pool.rewardTokens) {
    let poolStats = {},
      weeklyRewardRateOverride
    switch (pool.type) {
      case POOL_TYPES.INCENTIVE:
        poolStats = await getIncentivePoolStats(
          pool,
          poolContractData,
          lpTokenData,
          undefined,
          undefined,
          rewardTokenAddress,
          size(pool.rewardTokens) >= 2,
        )
        if (pool.chain === CHAIN_TYPES.ETH) {
          poolStats.apy = getWeeklyCompound(poolStats.apr)
        } else {
          poolStats.apy = poolStats.apr
        }
        break
      case POOL_TYPES.UNIV3:
        poolStats = await getIncentivePoolStats(
          pool,
          poolContractData,
          lpTokenData,
          undefined,
          undefined,
          rewardTokenAddress,
          size(pool.rewardTokens) >= 2,
        )

        if (rewardTokenAddress === addresses.iFARM) {
          poolStats.apr = new BigNumber(poolStats.apr).toFixed()
        }
        if (pool.chain === CHAIN_TYPES.ETH && rewardTokenAddress === addresses.iFARM) {
          poolStats.apy = getWeeklyCompound(poolStats.apr)
        } else {
          poolStats.apy = new BigNumber(poolStats.apr).toFixed(2)
        }
        break
      case POOL_TYPES.PROFIT_SHARING:
        poolStats = await getIncentivePoolStats(
          pool,
          poolContractData,
          lpTokenData,
          undefined,
          undefined,
          rewardTokenAddress,
        )
        poolStats.apy = getDailyCompound(poolStats.apr)
        break
      case POOL_TYPES.INCENTIVE_BUYBACK:
        weeklyRewardRateOverride = weeklyReward
        if (
          !weeklyRewardRateOverride &&
          pool.chain === CHAIN_TYPES.ETH &&
          (rewardTokenAddress === tokenAddresses.iFARM ||
            rewardTokenAddress === tokenAddresses.FARM)
        ) {
          const wsPoolInstance = new web3Socket.eth.Contract(
            rewardTokenAddress === tokenAddresses.iFARM
              ? potPoolContractInfo.contract.abi
              : poolContractInfo.contract.abi,
            pool.contractAddress,
          )

          const mostRecentBlockNumber = await web3.eth.getBlockNumber()
          const blockTenDaysAgo = Number(mostRecentBlockNumber) - 64000 // Average blocks per day is ~6400, so this is ten days worth

          const rewardEvents = (
            await wsPoolInstance.getPastEvents('RewardAdded', {
              fromBlock: blockTenDaysAgo,
              toBlock: 'latest',
            })
          ).map(event => ({
            txHash: event.transactionHash,
            returnValues: event.returnValues,
            blockNumber: event.blockNumber,
          }))

          const filteredEvents = []

          if (rewardEvents.length > 0) {
            await forEach(rewardEvents, async event => {
              const tx = await web3.eth.getTransaction(event.txHash)
              if (tx.from === tokenAddresses.FOOD) {
                filteredEvents.push(event)
              }
            })
          }

          const mostRecentEvent =
            filteredEvents.length > 0 ? filteredEvents[filteredEvents.length - 1] : null

          if (mostRecentEvent) {
            const blockN = await web3.eth.getTransaction(mostRecentEvent.txHash)

            const blockData = await web3.eth.getBlock(blockN.blockNumber)

            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

            if (new Date(Number(blockData.timestamp) * 1000) >= oneWeekAgo) {
              const mostRecentWeeklyReward = new BigNumber(mostRecentEvent.returnValues.reward)
                .dividedBy(new BigNumber(10).pow(18))
                .toFixed()

              weeklyRewardRateOverride = mostRecentWeeklyReward
            } else {
              weeklyRewardRateOverride = 0
            }
          } else {
            weeklyRewardRateOverride = 0
          }
        }

        poolStats = await getIncentivePoolStats(
          pool,
          poolContractData,
          lpTokenData,
          weeklyRewardRateOverride,
          undefined,
          rewardTokenAddress,
          size(pool.rewardTokens) >= 2,
        )
        poolStats.apy = getWeeklyCompound(poolStats.apr)
        break
      default:
        break
    }

    allPoolStats.push(poolStats)
  }
  const result = allPoolStats.reduce(
    (acc, stats) => {
      acc.apy.push(stats.apy)
      acc.apr.push(stats.apr)
      acc.rewardRate.push(stats.rewardRate)
      acc.totalSupply = stats.totalSupply
      acc.lpTokenPrice = stats.lpTokenPrice
      acc.periodFinish = stats.periodFinish
      return acc
    },
    {
      apy: [],
      apr: [],
      rewardRate: [],
      totalSupply: 0,
      lpTokenPrice: 0,
      periodFinish: 0,
    },
  )
  if (!fresh) {
    cache.set(`poolRewardApy${pool.id}`, result, GENERAL_CACHE_TTL)
  }

  return result
}

module.exports = {
  getPoolStatsPerType,
  getIncentivePoolStats,
}
