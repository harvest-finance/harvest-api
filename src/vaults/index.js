const BigNumber = require('bignumber.js')
const { getWeb3, resetCallCount, getCallCount } = require('../lib/web3')
const { cache } = require('../lib/cache')
const addresses = require('../lib/data/addresses.json')
const { vault: vaultContractData } = require('../lib/web3/contracts')
const { executeEstimateApyFunctions } = require('./apys')
const { getTokenPrice } = require('../prices')
const { getPosId } = require('../prices/implementations/uniswap-v3.js')
const { getPositions } = require('../lib/web3/contracts/uni-non-fungible-manager/methods')
const { omit, get, find, isArray, toString } = require('lodash')
const { getTotalSupply } = require('../lib/web3/contracts/vault/methods')
const managedVaultData = require('../lib/web3/contracts/uniswap-v3-vault/contract.json')
const uniNonFungibleContractData = require('../lib/web3/contracts/uni-non-fungible-manager/contract.json')
const {
  getCap,
  getDepositCapReached,
  getWithdrawalTimestamp,
  getCurrentCap,
  getPositionIds,
  getCurrentRangePositionId,
} = require('../lib/web3/contracts/uniswap-v3-vault/methods')
const contractData = require('../lib/web3/contracts/token/contract.json')
const { getSymbol, getDecimals } = require('../lib/web3/contracts/token/methods.js')
const { VAULT_CATEGORIES_IDS } = require('../../data/constants')
const {
  DB_CACHE_IDS,
  DEBUG_MODE,
  WEB3_CALL_COUNT_STATS_KEY,
  PROFIT_SHARING_POOL_ID,
  UI_DATA_FILES,
  POOL_TYPES,
} = require('../lib/constants')
const { Cache } = require('../lib/db/models/cache')
const { getUIData } = require('../lib/data')
const { forEach } = require('promised-loops')

const fetchAndExpandVault = async symbol => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const pools = await getUIData(UI_DATA_FILES.POOLS)

  if (DEBUG_MODE) {
    resetCallCount()
  }
  const {
    methods: { getUnderlyingBalanceWithInvestment, getPricePerFullShare },
    contract: { abi },
  } = vaultContractData

  const web3Instance = getWeb3(tokens[symbol].chain)

  let profitShareAPY,
    underlyingBalanceWithInvestment = null,
    pricePerFullShare = null,
    usdPrice = null,
    totalSupply = null,
    uniswapV3PositionId = null,
    uniswapV3UnderlyingTokenPrices = [],
    totalValueLocked = null,
    uniswapV3ManagedData = null

  const vaultData = tokens[symbol]
  vaultData.id = symbol

  const vaultInstance = new web3Instance.eth.Contract(abi, vaultData.vaultAddress)

  totalSupply = await getTotalSupply(vaultInstance)

  //HOTFIX
  try {
    underlyingBalanceWithInvestment = await getUnderlyingBalanceWithInvestment(vaultInstance)
    pricePerFullShare = await getPricePerFullShare(vaultInstance)
  } catch (error) {
    underlyingBalanceWithInvestment = totalSupply
    pricePerFullShare = 1
  }

  const { estimatedApy, estimatedApyBreakdown } = await executeEstimateApyFunctions(
    symbol,
    vaultData.estimateApyFunctions,
  )

  const dbData = await Cache.find({
    type: { $in: [DB_CACHE_IDS.STATS, DB_CACHE_IDS.POOLS] },
  })

  const fetchedStats = dbData.find(result => result.type === DB_CACHE_IDS.STATS)

  profitShareAPY = get(fetchedStats, 'data.tokenStats.historicalAverageProfitSharingAPY', 0)

  const vaultPool = find(pools, pool => pool.collateralAddress === vaultData.vaultAddress, {})
  const hasIFarmReward =
    vaultPool &&
    vaultPool.rewardTokens.length === 1 &&
    vaultPool.rewardTokens.includes(addresses.iFARM)

  if (!profitShareAPY) {
    const fetchedPools = dbData.find(result => result.type === DB_CACHE_IDS.POOLS)

    profitShareAPY = get(
      find(get(fetchedPools, 'data.eth', []), pool => pool && pool.id === 'profit-sharing-farm'),
      'rewardAPY',
      get(cache.get(`poolRewardApy${PROFIT_SHARING_POOL_ID}`), 'apy', 0),
    )
  }

  const boostedEstimatedAPY = hasIFarmReward
    ? new BigNumber(estimatedApy)
        .times(new BigNumber(profitShareAPY).plus(100))
        .dividedBy(100)
        .toFixed(2)
    : null

  if (vaultPool && vaultPool.type === POOL_TYPES.UNIV3) {
    uniswapV3PositionId = await getPosId(vaultData.vaultAddress, web3Instance)
  }

  usdPrice = (await getTokenPrice(symbol)).toString()

  if (DEBUG_MODE) {
    const currentCache = cache.get(WEB3_CALL_COUNT_STATS_KEY)
    cache.set(WEB3_CALL_COUNT_STATS_KEY, {
      ...currentCache,
      vaults: [...currentCache.vaults, { symbol, callCount: getCallCount() }],
    })
    resetCallCount()
  }

  totalValueLocked = new BigNumber(underlyingBalanceWithInvestment)
    .multipliedBy(usdPrice)
    .dividedBy(new BigNumber(10).exponentiatedBy(Number(vaultData.decimals)))
    .toString()

  if (isArray(vaultData.tokenAddress)) {
    await forEach(vaultData.tokenAddress, async tokenAddress => {
      const tokenPrice = await getTokenPrice(tokenAddress)
      uniswapV3UnderlyingTokenPrices.push(toString(tokenPrice))
    })
  }

  if (vaultData.category === VAULT_CATEGORIES_IDS.UNIV3MANAGED) {
    let cap = [],
      capLimit = null,
      capToken = null,
      capTokenSymbol = null,
      capTokenDecimal = null,
      depositReached = false,
      withdrawalTimestamp = null,
      currentCap = null,
      positionIds = [],
      currentRangePositionId = null,
      ranges = [],
      currentRange = {}

    const managedVaultInstance = new web3Instance.eth.Contract(
      managedVaultData.abi,
      vaultData.vaultAddress,
    )

    cap = await getCap(managedVaultInstance)
    capLimit = cap[0]
    capToken = cap[1]

    positionIds = await getPositionIds(managedVaultInstance)
    currentRangePositionId = await getCurrentRangePositionId(managedVaultInstance)

    const nonfungibleContractInstance = new web3Instance.eth.Contract(
      uniNonFungibleContractData.abi,
      uniNonFungibleContractData.address.mainnet,
    )

    for (let i = 0; i < positionIds.length; i++) {
      let positions = await getPositions(positionIds[i], nonfungibleContractInstance)
      let token0 = new web3Instance.eth.Contract(contractData.abi, positions.token0)
      let token1 = new web3Instance.eth.Contract(contractData.abi, positions.token1)
      let token0Decimal = await getDecimals(token0)
      let token1Decimal = await getDecimals(token1)

      ranges[i] = {}
      ranges[i].posId = positionIds[i]
      ranges[i].token0Symbol = await getSymbol(token0)
      ranges[i].token1Symbol = await getSymbol(token1)

      if (positions.token0 !== capToken) {
        ranges[i].lowerBound =
          1 / (Math.pow(1.0001, positions.tickUpper) * Math.pow(10, token0Decimal - token1Decimal))
        ranges[i].upperBound =
          1 / (Math.pow(1.0001, positions.tickLower) * Math.pow(10, token0Decimal - token1Decimal))
      } else {
        ranges[i].lowerBound =
          1 / (Math.pow(1.0001, positions.tickUpper) * Math.pow(10, token1Decimal - token0Decimal))
        ranges[i].upperBound =
          1 / (Math.pow(1.0001, positions.tickLower) * Math.pow(10, token1Decimal - token0Decimal))
      }

      ranges[i].lowerBound = Math.floor(ranges[i].lowerBound)
      ranges[i].upperBound = Math.ceil(ranges[i].upperBound)

      if (positionIds[i] == currentRangePositionId) {
        currentRange.posId = positionIds[i]
        currentRange.lowerBound = ranges[i].lowerBound
        currentRange.upperBound = ranges[i].upperBound
      }
    }

    depositReached = await getDepositCapReached(managedVaultInstance)
    withdrawalTimestamp = await getWithdrawalTimestamp(managedVaultInstance)

    if (capToken !== '0x0000000000000000000000000000000000000000' && capToken !== null) {
      const contractInstance = new web3Instance.eth.Contract(contractData.abi, capToken)
      capTokenSymbol = await getSymbol(contractInstance)
      capTokenDecimal = await getDecimals(contractInstance)
      currentCap = await getCurrentCap(managedVaultInstance)
    }

    uniswapV3ManagedData = {
      capLimit,
      capToken,
      capTokenSymbol,
      capTokenDecimal,
      depositReached,
      withdrawalTimestamp,
      currentCap,
      ranges,
      currentRange,
    }
  }

  return {
    ...omit(vaultData, ['priceFunction', 'estimateApyFunctions']),
    pricePerFullShare,
    estimatedApy,
    estimatedApyBreakdown,
    boostedEstimatedAPY,
    underlyingBalanceWithInvestment,
    usdPrice,
    totalSupply,
    totalValueLocked,
    uniswapV3PositionId,
    uniswapV3UnderlyingTokenPrices,
    uniswapV3ManagedData,
    rewardPool: vaultPool ? vaultPool.contractAddress : null,
  }
}

const getVaultsData = async vaultsToFetch => Promise.all(vaultsToFetch.map(fetchAndExpandVault))

module.exports = {
  getVaultsData,
  fetchAndExpandVault,
}
