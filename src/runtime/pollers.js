const BigNumber = require('bignumber.js')

const { forEach } = require('promised-loops')
const { pickBy, get, chunk, isArray, sumBy, size } = require('lodash')

const { getVaultsData } = require('../vaults')
const { getPoolsData } = require('../pools')
const {
  getPercentOfFARMStaked,
  getHistoricalAverageProfitSharingAPY,
  getTotalGasSaved,
  getTotalMarketCap,
  getMonthlyProfits,
} = require('../lib/token-stats')
const { resetCallCount, printCallCountResults, updateCallCountCache } = require('../lib/web3')
const { cache } = require('../lib/cache')
const { prefetchPriceByAddresses, prefetchPriceByIds } = require('../prices')
const {
  UPDATE_LOOP_INTERVAL_MS,
  WEB3_CALL_COUNT_STATS_KEY,
  ENDPOINT_TYPES,
  ACTIVE_ENDPOINTS,
  GET_PRICE_TYPES,
  CHAIN_TYPES,
  GET_POOL_DATA_BATCH_SIZE,
  GET_VAULT_DATA_BATCH_SIZE,
  DEBUG_MODE,
  DB_CACHE_IDS,
  UI_DATA_FILES,
} = require('../lib/constants')
const { Cache } = require('../lib/db/models/cache')
const { storeData, loadData } = require('../lib/db/models/cache')
const { getUIData } = require('../lib/data')
const addresses = require('../lib/data/addresses.json')

const getProfitSharingFactor = chain => {
  switch (chain) {
    case CHAIN_TYPES.BSC:
      return 0.92
    case CHAIN_TYPES.MATIC:
      return 0.92
    default:
      return 0.7
  }
}

const getVaults = async () => {
  console.log('\n-- Getting vaults data --')
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  let fetchedETHVaults = [],
    fetchedBSCVaults = [],
    fetchedMATICVaults = [],
    fetchedVaults,
    hasErrors = false

  const tokensWithVault = pickBy(tokens, token => token.vaultAddress)

  const ethVaultsBatches = chunk(
    Object.keys(tokensWithVault).filter(tokenId => tokens[tokenId].chain === CHAIN_TYPES.ETH),
    GET_VAULT_DATA_BATCH_SIZE,
  )

  const bscVaultsBatches = chunk(
    Object.keys(tokensWithVault).filter(tokenId => tokens[tokenId].chain === CHAIN_TYPES.BSC),
    GET_VAULT_DATA_BATCH_SIZE,
  )

  const maticVaultsBatches = chunk(
    Object.keys(tokensWithVault).filter(tokenId => tokens[tokenId].chain === CHAIN_TYPES.MATIC),
    GET_VAULT_DATA_BATCH_SIZE,
  )

  console.log('\n-- Getting BSC vaults data --')
  await forEach(bscVaultsBatches, async batch => {
    try {
      console.log('Getting vault data for: ', batch)
      const vaultsData = await getVaultsData(batch)
      fetchedBSCVaults = fetchedBSCVaults.concat(vaultsData)
    } catch (err) {
      hasErrors = true
      console.error(`Failed to get vault data for: ${batch}`, err)
    }
  })
  console.log('\n-- Done getting BSC vaults data --')

  console.log('\n-- Getting MATIC vaults data --')
  await forEach(maticVaultsBatches, async batch => {
    try {
      console.log('Getting vault data for: ', batch)
      const vaultsData = await getVaultsData(batch)
      fetchedMATICVaults = fetchedMATICVaults.concat(vaultsData)
    } catch (err) {
      hasErrors = true
      console.error(`Failed to get vault data for: ${batch}`, err)
    }
  })
  console.log('\n-- Done getting MATIC vaults data --')

  console.log('\n-- Getting ETH vaults data --')
  await forEach(ethVaultsBatches, async batch => {
    try {
      console.log('Getting vault data for: ', batch)
      const vaultsData = await getVaultsData(batch)
      fetchedETHVaults = fetchedETHVaults.concat(vaultsData)
    } catch (err) {
      hasErrors = true
      console.error(`Failed to get vault data for: ${batch}`, err)
    }
  })
  console.log('\n-- Done getting ETH vaults data --')

  fetchedVaults = {
    bsc: fetchedBSCVaults.reduce((acc, vault) => {
      acc[vault.id] = vault
      return acc
    }, {}),
    eth: fetchedETHVaults.reduce((acc, vault) => {
      acc[vault.id] = vault
      return acc
    }, {}),
    matic: fetchedMATICVaults.reduce((acc, vault) => {
      acc[vault.id] = vault
      return acc
    }, {}),
  }

  console.log('\n-- Done getting vaults data --')

  await storeData(
    Cache,
    DB_CACHE_IDS.VAULTS,
    {
      ...fetchedVaults,
    },
    hasErrors,
  )
}

const getTokenStats = async () => {
  console.log('\n-- Getting FARM token stats --')
  const tokenStats = {}

  try {
    console.log('Getting percent of FARM staked')
    tokenStats.percentStaked = await getPercentOfFARMStaked()
  } catch (err) {
    console.error('Failed to get percent of farm staked: ', err)
  }

  try {
    console.log('Getting FARM price historical average')
    tokenStats.historicalAverageProfitSharingAPY = await getHistoricalAverageProfitSharingAPY()
  } catch (err) {
    console.error('Failed to get historical average of FARM price: ', err)
  }

  try {
    console.log('Getting total gas saved by protocol')
    tokenStats.totalGasSaved = await getTotalGasSaved()
  } catch (err) {
    console.error('Failed to get total gas saved by protocol: ', err)
  }

  try {
    console.log('Getting total FARM market cap')
    tokenStats.totalMarketCap = await getTotalMarketCap()
  } catch (err) {
    console.error('Failed to get total FARM market cap: ', err)
  }

  try {
    console.log('Getting monthly profit')
    tokenStats.monthlyProfits = await getMonthlyProfits()
  } catch (err) {
    console.error('Failed to get monthly profits: ', err)
  }

  const hasErrors =
    !tokenStats.percentStaked ||
    !tokenStats.historicalAverageProfitSharingAPY ||
    !tokenStats.totalGasSaved ||
    !tokenStats.totalMarketCap

  await storeData(
    Cache,
    DB_CACHE_IDS.STATS,
    {
      tokenStats,
    },
    hasErrors,
  )
  console.log('-- Done getting FARM token stats --\n')
}

const getPools = async () => {
  console.log('\n-- Getting BSC pool data --')
  const pools = await getUIData(UI_DATA_FILES.POOLS)
  let fetchedBSCPools = [],
    fetchedETHPools = [],
    fetchedMATICPools = [],
    fetchedPools = [],
    hasErrors

  try {
    const bscPoolBatches = chunk(
      pools.filter(pool => pool.chain === CHAIN_TYPES.BSC),
      GET_POOL_DATA_BATCH_SIZE,
    )

    if (size(bscPoolBatches)) {
      await forEach(bscPoolBatches, async poolBatch => {
        const poolData = await getPoolsData(poolBatch)
        fetchedBSCPools = fetchedBSCPools.concat(poolData)
      })
    } else {
      console.log('No pools available')
    }
    console.log('-- Done getting BSC pool data --\n')

    console.log('\n-- Getting MATIC pool data --')

    const maticPoolBatches = chunk(
      pools.filter(pool => pool.chain === CHAIN_TYPES.MATIC),
      GET_POOL_DATA_BATCH_SIZE,
    )

    if (size(maticPoolBatches)) {
      await forEach(maticPoolBatches, async poolBatch => {
        const poolData = await getPoolsData(poolBatch)
        fetchedMATICPools = fetchedMATICPools.concat(poolData)
      })
    } else {
      console.log('No pools available')
    }

    console.log('-- Done getting MATIC pool data --\n')

    console.log('\n-- Getting ETH pool data --')

    const ethPoolBatches = chunk(
      pools.filter(pool => pool.chain === CHAIN_TYPES.ETH),
      GET_POOL_DATA_BATCH_SIZE,
    )
    if (size(ethPoolBatches)) {
      await forEach(ethPoolBatches, async poolBatch => {
        const poolData = await getPoolsData(poolBatch)
        fetchedETHPools = fetchedETHPools.concat(poolData)
      })
    } else {
      console.log('No pools available')
    }
    console.log('-- Done getting ETH pool data --\n')
  } catch (err) {
    console.error('error getting pools', err)
    hasErrors = true
  }

  fetchedPools = {
    bsc: fetchedBSCPools,
    eth: fetchedETHPools,
    matic: fetchedMATICPools,
  }
  hasErrors =
    (isArray(fetchedBSCPools) &&
      (fetchedBSCPools.includes(undefined) || fetchedBSCPools.includes(null))) ||
    (isArray(fetchedETHPools) &&
      (fetchedETHPools.includes(undefined) || fetchedETHPools.includes(null))) ||
    (isArray(fetchedMATICPools) &&
      (fetchedMATICPools.includes(undefined) || fetchedMATICPools.includes(null)))

  await storeData(
    Cache,
    DB_CACHE_IDS.POOLS,
    {
      ...fetchedPools,
    },
    hasErrors,
  )
  console.log('-- Done getting pool data --\n')
}

const getTotalGmv = async () => {
  console.log('\n-- Getting total GMV --')
  const pools = await loadData(Cache, DB_CACHE_IDS.POOLS)
  const vaults = await loadData(Cache, DB_CACHE_IDS.VAULTS)

  if (!pools || !vaults) {
    console.log(`Error getting total GMV due to missing data. Pools: ${pools}, vaults: ${vaults}`)
    return
  }

  let totalGmv = new BigNumber(0),
    hasErrors

  const gmvList = {}

  for (let networkId in vaults) {
    for (let symbol in vaults[networkId]) {
      const vault = vaults[networkId][symbol]
      if (vault.inactive) {
        continue
      }

      try {
        console.log('Got GMV for:', vault.id, ':', vault.totalValueLocked)
        gmvList[symbol] = vault.totalValueLocked
      } catch (err) {
        console.log(`Error getting GMV for: ${symbol}`, err)
        hasErrors = true
      }

      totalGmv = totalGmv.plus(vault.totalValueLocked)
    }
  }

  const relevantPools = pools['eth'].filter(
    pool =>
      pool.id === 'profit-sharing-farm' || pool.id === 'farm-weth' || pool.id === 'farm-grain',
  )

  await forEach(relevantPools, async relevantPool => {
    try {
      console.log('Getting GMV for: ', relevantPool.id, ':', relevantPool.totalValueLocked)
      totalGmv = totalGmv.plus(relevantPool.totalValueLocked)
    } catch (err) {
      console.log(`Error getting GMV for: ${relevantPool.id}`, err)
      hasErrors = true
    }
  })

  await storeData(
    Cache,
    DB_CACHE_IDS.STATS,
    {
      totalGmv: totalGmv.toFixed(),
      gmvList,
    },
    hasErrors,
  )
  console.log('-- Done getting total GMV --\n')
}

const getWeeklyBuybacks = async () => {
  console.log('\n-- Getting weekly buybacks --')

  const vaults = await loadData(Cache, DB_CACHE_IDS.VAULTS)
  const pools = await loadData(Cache, DB_CACHE_IDS.POOLS)
  if (!vaults) {
    console.log(`Error getting weekly buybacks due to missing data. Vaults: ${vaults}`)
    return
  } else if (!pools) {
    console.log(`Error getting weekly buybacks due to missing data. Pools: ${pools}`)
    return
  }

  let totalWeeklyBuyback = new BigNumber(0),
    hasErrors

  const weeklyBuybackList = {},
    weeklyBuybackPerNetworkList = {}

  for (let networkId in vaults) {
    let weeklyBuybackPerNetwork = new BigNumber(0)
    for (let symbol in vaults[networkId]) {
      const vault = vaults[networkId][symbol]
      let weeklyBuyback = 0
      if (!vault.inactive && symbol != 'IFARM') {
        const tokenGmv = vault.totalValueLocked
        let profitSharingFactor = getProfitSharingFactor(vault.chain)
        let estimatedApy
        if (
          vault.category == 'UNIV3' ||
          vault.category[0] == 'UNIV3' ||
          vault.category[1] == 'UNIV3'
        ) {
          const poolToFetch = pools[networkId].find(
            pool =>
              pool.id === symbol ||
              (pool.collateralAddress &&
                pool.collateralAddress.toLowerCase() === vault.vaultAddress.toLowerCase()),
          )
          estimatedApy = poolToFetch.tradingApy
          if (vault.estimatedApy > 0) {
            estimatedApy = Number(estimatedApy) + Number(vault.estimatedApy)
          }
        } else if (vault.category == 'SUSHI_HODL') {
          profitSharingFactor = 0.85
          estimatedApy = vault.estimatedApy
        } else {
          estimatedApy = vault.estimatedApy
        }

        const dailyApr = Math.pow(Number(estimatedApy / 100) + 1, 1 / 365) - 1
        const weeklyApr = dailyApr * 7

        const weeklyRevenue = new BigNumber(tokenGmv)
          .multipliedBy(weeklyApr)
          .dividedBy(profitSharingFactor)

        weeklyBuyback = weeklyRevenue.times(1 - profitSharingFactor)

        weeklyBuybackList[symbol] = weeklyBuyback.toString()

        console.log(
          'Got weekly profit for: ',
          symbol,
          ':',
          weeklyBuyback.toFixed(4),
          '|',
          tokenGmv,
          estimatedApy,
          profitSharingFactor,
        )
      } else {
        weeklyBuybackList[symbol] = '0'
      }
      totalWeeklyBuyback = totalWeeklyBuyback.plus(weeklyBuyback)
      weeklyBuybackPerNetwork = weeklyBuybackPerNetwork.plus(weeklyBuyback)
    }
    weeklyBuybackPerNetworkList[networkId] = weeklyBuybackPerNetwork.toString()
  }

  await storeData(
    Cache,
    DB_CACHE_IDS.STATS,
    {
      weeklyBuyback: totalWeeklyBuyback.toFixed(),
      weeklyBuybackPerVault: weeklyBuybackList,
      weeklyBuybackPerNetwork: weeklyBuybackPerNetworkList,
    },
    hasErrors,
  )
  console.log('-- Done getting weekly buybacks --\n')
}

const getTotalRevenue = async () => {
  console.log('\n-- Getting total revenue --')

  const vaults = await loadData(Cache, DB_CACHE_IDS.VAULTS)
  if (!vaults) {
    console.log(`Error getting revenue due to missing data. Vaults: ${vaults}`)
    return
  }

  let totalRevenue = new BigNumber(0),
    totalRevenueMonthly = new BigNumber(0),
    hasErrors

  const revenueList = {},
    apyList = {},
    revenueListMonthly = {},
    revenueListDaily = {}

  for (let networkId in vaults) {
    for (let symbol in vaults[networkId]) {
      const vault = vaults[networkId][symbol]
      let revenue = 0,
        revenueMonthly = 0
      if (!vault.inactive) {
        const tokenGmv = vault.totalValueLocked
        const estimatedApy = vault.estimatedApy

        const dailyApr = Math.pow(Number(estimatedApy / 100) + 1, 1 / 365) - 1
        const monthlyApy = (Math.pow(1 + dailyApr, 30) - 1) * 100

        const profitSharingFactor = getProfitSharingFactor(vault.chain)

        revenue = new BigNumber(tokenGmv)
          .multipliedBy(estimatedApy)
          .dividedBy(100)
          .dividedBy(profitSharingFactor)
        revenueMonthly = new BigNumber(tokenGmv)
          .multipliedBy(monthlyApy)
          .dividedBy(100)
          .dividedBy(profitSharingFactor)
        const revenueDaily = new BigNumber(tokenGmv)
          .multipliedBy(dailyApr)
          .dividedBy(100)
          .dividedBy(profitSharingFactor)

        apyList[symbol] = estimatedApy.toString()
        revenueList[symbol] = revenue.toString()
        revenueListMonthly[symbol] = revenueMonthly.toString()
        revenueListDaily[symbol] = revenueDaily.toString()

        console.log(
          'Got monthly revenue for: ',
          symbol,
          ':',
          revenueMonthly.toString(),
          '|',
          tokenGmv,
          estimatedApy,
          profitSharingFactor,
        )
      } else {
        console.log('skipping getting revenue for inactive vault: ', symbol)
        revenueListMonthly[symbol] = '0'
        revenueListDaily[symbol] = '0'
        apyList[symbol] = '0'
        revenueList[symbol] = '0'
      }

      totalRevenue = totalRevenue.plus(revenue)
      totalRevenueMonthly = totalRevenueMonthly.plus(revenueMonthly)
    }
  }

  await storeData(
    Cache,
    DB_CACHE_IDS.STATS,
    {
      totalRevenue: totalRevenue.toFixed(),
      monthlyRevenue: totalRevenueMonthly.toFixed(),
      revenueList,
      revenueListMonthly,
      apyList,
    },
    hasErrors,
  )
  console.log('-- Done getting total revenue --\n')
}

const getCmc = async () => {
  console.log('\n-- Getting CMC data --')
  const pools = await loadData(Cache, DB_CACHE_IDS.POOLS)
  const vaults = await loadData(Cache, DB_CACHE_IDS.VAULTS)
  if (!pools || !vaults) {
    console.log(`Error getting CMC due to missing data. Pools: ${pools}, vaults: ${vaults}`)
    return
  }

  const response = {
    provider: 'Harvest Finance', // Project name
    provider_logo: 'https://harvest.finance/favicon-96x96.png', // Project logo, square, less than 100*100 px
    provider_URL: 'https://harvest.finance/', // Project URL
    links: [
      // social media info
      {
        title: 'Twitter',
        link: 'https://twitter.com/harvest_finance',
      },
      {
        title: 'Medium',
        link: 'https://medium.com/harvest-finance',
      },
      {
        title: 'Reddit',
        link: 'https://www.reddit.com/r/HarvestFinance/',
      },
      {
        title: 'Discord',
        link: 'https://discord.gg/R5SeTVR',
      },
      {
        title: 'Telegram',
        link: 'https://t.me/Breadforthepeople',
      },
      {
        title: 'Github',
        link: 'https://github.com/harvest-finance',
      },
    ],
    pools: [],
  }

  let hasErrors

  try {
    for (let networkId in vaults) {
      for (let symbol in vaults[networkId]) {
        const vault = vaults[networkId][symbol]

        if (
          !(
            !isArray(vault.tokenAddress) &&
            vault.tokenAddress.toLowerCase() === addresses.iFARM.toLowerCase()
          ) &&
          !vault.inactive
        ) {
          console.log('Getting CMC data for: ', symbol)

          const totalStaked = vault.totalValueLocked
          const estimatedApy = vault.estimatedApy

          // Now, getting the relevant pool
          const relevantPool = pools[networkId].find(
            pool =>
              pool.collateralAddress &&
              pool.collateralAddress.toLowerCase() === vault.vaultAddress.toLowerCase() &&
              pool.chain === vault.chain,
          )

          // now, pushing into an array
          response.pools.push({
            name: `${symbol} Vault`, // Pool name if any, eg. Sushi Party, Uniswap Sushi-ETH LP
            pair: symbol, // Pool pairs, e.g SUSHI-ETH
            pairLink: 'https://harvest.finance/', // The URL to this pool
            logo: `https://harvest.finance/${vault.logoUrl.substring(2)}`, //  Pool logo if any, otherwise just use Project logo
            poolRewards: vault.cmcRewardTokenSymbols, // The reward token ticker
            apr: new BigNumber(estimatedApy)
              .plus(sumBy(relevantPool.apy, apy => Number(apy)))
              .dividedBy(100)
              .toString(), // APY, 1.1 means 110%
            totalStaked: totalStaked.toString(), // Total valued lock in USD
          })
        }
      }

      // Now, getting profit sharing pool and USDC/FARM UNI pool
      const relevantPools = pools[networkId].filter(
        pool =>
          pool.id === 'profit-sharing-farm' || pool.id === 'farm-weth' || pool.id === 'farm-grain',
      )

      for (let relevantPool of relevantPools) {
        try {
          console.log('Getting CMC data for: ', relevantPool.id)

          if (relevantPool.id === 'profit-sharing-farm') {
            response.pools.push({
              name: `FARM Profit Sharing`, // Pool name if any, eg. Sushi Party, Uniswap Sushi-ETH LP
              pair: 'FARM', // Pool pairs, e.g SUSHI-ETH
              pairLink: 'https://harvest.finance', // The URL to this pool
              logo: 'https://harvest.finance/favicon-96x96.png', //  Pool logo if any, otherwise just use Project logo
              poolRewards: ['FARM'], // The reward token ticker
              apr: new BigNumber(get(relevantPool, 'apy[0]', 0)).dividedBy(100).toString(), // APY, 1.1 means 110%
              totalStaked: relevantPool.totalValueLocked, // Total valued lock in USD
            })
          }
          if (relevantPool.id === 'farm-weth') {
            response.pools.push({
              name: `FARM/ETH Pool`, // Pool name if any, eg. Sushi Party, Uniswap Sushi-ETH LP
              pair: 'FARM/ETH', // Pool pairs, e.g SUSHI-ETH
              pairLink: 'https://harvest.finance', // The URL to this pool
              logo: 'https://harvest.finance/favicon-96x96.png', //  Pool logo if any, otherwise just use Project logo
              poolRewards: ['FARM'], // The reward token ticker
              apr: new BigNumber(get(relevantPool, 'apy[0]', 0)).dividedBy(100).toString(), // APY, 1.1 means 110%
              totalStaked: relevantPool.totalValueLocked, // Total valued lock in USD
            })
          }
          if (relevantPool.id === 'farm-grain') {
            response.pools.push({
              name: `FARM/GRAIN Pool`, // Pool name if any, eg. Sushi Party, Uniswap Sushi-ETH LP
              pair: 'FARM/GRAIN', // Pool pairs, e.g SUSHI-ETH
              pairLink: 'https://harvest.finance', // The URL to this pool
              logo: 'https://harvest.finance/favicon-96x96.png', //  Pool logo if any, otherwise just use Project logo
              poolRewards: ['FARM'], // The reward token ticker
              apr: new BigNumber(get(relevantPool, 'apy[0]', 0)).dividedBy(100).toString(), // APY, 1.1 means 110%
              totalStaked: relevantPool.totalValueLocked, // Total valued lock in USD
            })
          }
        } catch (err) {
          hasErrors = true
          console.error(`error getting CMC data for: ${relevantPool.id}`, err)
        }
      }
    }
  } catch (err) {
    hasErrors = true
    console.log('Error getting CMC data', err)
  }

  await storeData(
    Cache,
    DB_CACHE_IDS.CMC,
    {
      ...response,
    },
    hasErrors,
  )

  console.log('-- Done getting CMC data --\n')
}

const preLoadCoingeckoPrices = async () => {
  console.log('\n-- Getting token prices from CoinGecko --')
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)

  const addresses = {}
  const ids = {}

  for (let tokenSymbol of Object.keys(tokens)) {
    const priceFunction = tokens[tokenSymbol].priceFunction
    if (priceFunction && priceFunction.type === GET_PRICE_TYPES.COINGECKO_CONTRACT) {
      addresses[priceFunction.params[0].toLowerCase()] = true
    }

    if (priceFunction && priceFunction.type === GET_PRICE_TYPES.LP_TOKEN) {
      if (
        tokens[priceFunction.params[0]] &&
        !isArray(tokens[priceFunction.params[0]].tokenAddress)
      ) {
        addresses[tokens[priceFunction.params[0]].tokenAddress.toLowerCase()] = true
      }
      if (
        tokens[priceFunction.params[1]] &&
        !isArray(tokens[priceFunction.params[1]].tokenAddress)
      ) {
        addresses[tokens[priceFunction.params[1]].tokenAddress.toLowerCase()] = true
      }
    }

    if (priceFunction && priceFunction.type === GET_PRICE_TYPES.COINGECKO_ID) {
      ids[priceFunction.params[0].toLowerCase()] = true
    }
  }

  console.log('Caching token prices...')
  await prefetchPriceByAddresses(
    Object.keys(addresses).join(),
    undefined,
    'usd',
    () => {
      console.log(`Prices fetched successfully for ${addresses}`)
    },
    err => {
      console.log(
        `Something went wrong during the preloading of prices through addresses! ${addresses}`,
        err,
      )
    },
  )

  await prefetchPriceByIds(
    Object.keys(ids).join(),
    'usd',
    () => {
      console.log(`Prices fetched successfully for ids: ${ids}`)
    },
    err => {
      console.log(`Something went wrong during the preloading of prices through ids! ${ids}`, err)
    },
  )
}

const runUpdateLoop = async () => {
  console.log('\n-- Starting data fetching --')

  if (DEBUG_MODE) {
    console.log('\n##################       DEBUG MODE       ###################')
    resetCallCount()
    cache.set(WEB3_CALL_COUNT_STATS_KEY, {
      pools: [],
      vaults: [],
      cmc: 0,
      gmv: 0,
      revenue: 0,
      tokenStats: 0,
    })
  }

  await preLoadCoingeckoPrices()
  await getTokenStats()
  if (DEBUG_MODE) {
    updateCallCountCache('tokenStats')
    resetCallCount()
  }

  await getPools()
  await getVaults()

  if (ACTIVE_ENDPOINTS === ENDPOINT_TYPES.ALL || ACTIVE_ENDPOINTS === ENDPOINT_TYPES.EXTERNAL) {
    await getTotalGmv()
    if (DEBUG_MODE) {
      updateCallCountCache('gmv')
      resetCallCount()
    }

    await getWeeklyBuybacks()
    if (DEBUG_MODE) {
      updateCallCountCache('profit')
      resetCallCount()
    }

    await getTotalRevenue()
    if (DEBUG_MODE) {
      updateCallCountCache('revenue')
      resetCallCount()
    }

    await getCmc()
    if (DEBUG_MODE) {
      updateCallCountCache('cmc')
      resetCallCount()
    }
  }

  if (DEBUG_MODE) {
    printCallCountResults()
  }
  console.log('-- Done with data fetching --')
}

const startPollers = async () => {
  await runUpdateLoop()

  setInterval(async () => {
    await runUpdateLoop()
  }, UPDATE_LOOP_INTERVAL_MS)
}

const cliPreload = async () => {
  await preLoadCoingeckoPrices()
  await getTokenStats()
}

module.exports = {
  startPollers,
  cliPreload,
}
