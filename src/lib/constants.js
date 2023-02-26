require('dotenv').config()
const INFURA_URL =
  process.env.MAINNET_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`
const INFURA_WS_URL =
  process.env.MAINNET_WS_URL || `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`
const COINGECKO_PRICE_API_ENDPOINT_CONTRACT = 'https://api.coingecko.com/api/v3/simple/token_price'
const COINGECKO_PRICE_API_ENDPOINT_ID = 'https://api.coingecko.com/api/v3/simple/price'
const API_KEY = process.env.API_KEY || 'harvest-key'
const APY_VISION_TOKEN = process.env.APY_VISION_TOKEN

const POOL_TYPES = {
  INCENTIVE: 'INCENTIVE',
  PROFIT_SHARING: 'PROFIT_SHARING',
  INCENTIVE_BUYBACK: 'INCENTIVE_BUYBACK',
  INACTIVE: 'INACTIVE',
  UNIV3: 'UNIV3',
}

const GET_PRICE_TYPES = {
  COINGECKO_CONTRACT: 'COINGECKO_CONTRACT',
  COINGECKO_ID: 'COINGECKO_ID',
  F_TOKEN: 'F_TOKEN',
  LP_TOKEN: 'LP_TOKEN',
  TOKEN_TO_USD_FARM: 'TOKEN_TO_USD_FARM',
  UNISWAP_PAIR: 'UNISWAP_PAIR',
  MANUAL: 'MANUAL',
  F_TOKEN_ID: 'F_TOKEN_ID',
  PANCAKESWAP_PAIR: 'PANCAKESWAP_PAIR',
  SUSHISWAP_PAIR: 'SUSHISWAP_PAIR',
  UNISWAP_V3: 'UNISWAP_V3',
  CURVE_POOL: 'CURVE_POOL',
  BALANCER: 'BALANCER',
  FARMSTEAD_USDC: 'FARMSTEAD_USDC',
  WRAPPED_TOKEN: 'WRAPPED_TOKEN',
}

const ESTIMATED_APY_TYPES = {
  NULL: 'NULL',
  CRV_GENERAL: 'CRV_GENERAL',
  MANUAL: 'MANUAL',
  SNX: 'SNX',
  MANUAL_NON_COMPOUNDING: 'MANUAL_NON_COMPOUNDING',
  COMPOUND: 'COMPOUND',
  SUSHI: 'SUSHI',
  IDLE_FINANCE: 'IDLE_FINANCE',
  NARWHALE: 'NARWHALE',
  BASIS: 'BASIS',
  NATIVE_SUSHI: 'NATIVE_SUSHI',
  SUSHI_PLUS_NATIVE: 'SUSHI_PLUS_NATIVE',
  MUSE: 'MUSE',
  ONEINCH: 'ONEINCH',
  VENUS: 'VENUS',
  PANCAKE: 'PANCAKE',
  VENUS_VAI_STAKING: 'VENUS_VAI_STAKING',
  GOOSE: 'GOOSE',
  BDO: 'BDO',
  ELLIPSIS: 'ELLIPSIS',
  BELT: 'BELT',
  SWIRL: 'SWIRL',
  SPACE: 'SPACE',
  POPSICLE: 'POPSICLE',
  COMPFI: 'COMPFI',
  CONVEX: 'CONVEX',
  BALANCER: 'BALANCER',
  BALANCER_POLYGON: 'BALANCER_POLYGON',
  MSTABLE: 'MSTABLE',
  LOOKSRARE_SINGLE_ASSET: 'LOOKSRARE_SINGLE_ASSET',
  STAKEWISE: 'STAKEWISE',
  AURA: 'AURA',
}

const TRADING_APY_TYPES = {
  LP: 'LP',
  BALANCER: 'BALANCER',
  UNIV3: 'UNIV3',
  UNIV3_V2: 'UNIV3_V2',
  RARI_FARMSTEAD_USDC: 'RARI_FARMSTEAD_USDC',
  CONVEX: 'CONVEX',
  BELT: 'BELT',
  VENUS: 'VENUS',
  MSTABLE: 'MSTABLE',
  LOOKS: 'LOOKS',
}

const COLLATERAL_TYPE = {
  NULL: 'NULL',
  BTC: 'BTC',
  ETH: 'ETH',
  LP: 'LP',
}

const ENDPOINT_TYPES = {
  ALL: 'all',
  INTERNAL: 'internal',
  EXTERNAL: 'external',
}

const CORS_SETTINGS = {
  origin: ['http://localhost:3000']
    .concat(process.env.CORS_STRINGS ? process.env.CORS_STRINGS.split(';') : [])
    .concat(
      process.env.CORS_REGEXPS
        ? process.env.CORS_REGEXPS.split(';').map(regExAsString => new RegExp(regExAsString))
        : [],
    ),
}

const UPDATE_LOOP_INTERVAL_MS = parseInt(process.env.UPDATE_LOOP_INTERVAL_MS, 10) || 3600000 // Default: 1 Hour
const HEALTH_ALERT_TIME_MS = parseInt(process.env.HEALTH_ALERT_TIME_MS, 10) || 5400000 // Default: 1.5 Hour

const ACTIVE_ENDPOINTS = (process.env.ACTIVE_ENDPOINTS || ENDPOINT_TYPES.INTERNAL).toLowerCase() // Default: ENDPOINT_TYPES.ALL

const CG_CACHE_TTL = parseInt(process.env.CG_CACHE_TTL, 10) || 600000 // Default: 10 Mins in ms

const GENERAL_CACHE_TTL = parseInt(process.env.GENERAL_CACHE_TTL, 10) || 600 // 10 Mins in s
const UI_DATA_CACHE_TTL = parseInt(process.env.UI_DATA_CACHE_TTL, 10) || 14400 // 4 Hours in s

const MAIN_CACHE_KEYS = {
  POOLS: 'pools',
  VAULTS: 'vaults',
  REVENUE: 'totalRevenue',
  REVENUE_MONTHLY: 'totalRevenueMonthly',
  GMV: 'totalGmv',
  CMC: 'cmc',
  TOKEN_STATS: 'tokenStats',
}

const HARVEST_LAUNCH_DATE = new Date(1598986800000) // Tuesday, September 1, 2020 7:00:00 PM UTC

const COMPOUND_CTOKEN_API_URL = 'https://api.compound.finance/api/v2/ctoken'

const APY_VISION_API_URL = 'https://stats.apy.vision/api/v1'

const SUSHI_POOLS_IDS = {
  USDT: 0,
  USDC: 1,
  DAI: 2,
  WBTC: 21,
  SUSHI: 12,
  UST: 85,
  PERP: 156,
}

const BASIS_POOL_IDS = {
  'BAC-DAI': 0,
  'BAS-DAI': 2,
}

const HISTORICAL_AVERAGE_PROFIT_SHARING_APY_DAYS = 14
const HISTORICAL_AVERAGE_PROFIT_SHARING_APY_ENDPOINT = `https://ethparser-api.herokuapp.com/apy/average/0x25550cccbd68533fa04bfd3e3ac4d09f9e00fc50?days=${HISTORICAL_AVERAGE_PROFIT_SHARING_APY_DAYS}`

const TOTAL_GAS_SAVED_ENDPOINT = `https://ethparser-api.herokuapp.com/last_saved_gas_sum`

const MONTHLY_PROFITS_ENDPOINT = `http://ethparser.herokuapp.com/last/hardwork`

const SUSHI_GRAPHQL_ENDPOINTS_TYPES = {
  BAR: 'BAR',
  EXCHANGE: 'EXCHANGE',
  ETH: 'ETH',
}

const SUSHI_GRAPHQL_ENDPOINTS = {
  BAR: 'https://api.thegraph.com/subgraphs/name/sushi-labs/xsushi',
  EXCHANGE: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  ETH: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
}

const CHAIN_TYPES = {
  ETH: '1',
  BSC: '56',
  MATIC: '137',
}

const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed2.binance.org/'
const MATIC_RPC_URL =
  process.env.MATIC_RPC_URL ||
  `https://polygon-mainnet.infura.io/v3/${process.env.MATIC_INFURA_KEY}`

const VENUS_API_URL = 'https://api.venus.io/api/governance/venus'
const BDO_API_URL = 'https://api.bdollar.fi/api/bdollar/'
const ELLIPSIS_API_URL = 'https://api.ellipsis.finance/api/'
const SWIRL_API_URL = 'https://api.swirl.cash/'
const BELT_API_URL = 'https://s.belt.fi/info/all.json'
const MSTABLE_API_URL = 'https://api.mstable.org/pools'
const APE_API_URL = 'https://ape-swap-api.herokuapp.com'

const BALANCER_SUBGRAPH_URLS = {
  ETH: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
  MATIC: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
}

const LIDO_API_URLS = { ETH: 'https://eth-api.lido.fi/v1/protocol/steth/apr/sma' }
const ROCKETPOOL_API_URLS = { ETH: 'https://api.rocketpool.net/api/apr' }

const STAKEWISE_API_URLS = {
  LIQUIDITY: 'https://api.stakewise.io/uniswap-pools/',
  STAKING: 'https://api.stakewise.io/pool-stats/',
}

const DEBUG_MODE = process.env.DEBUG_MODE

const WEB3_CALL_COUNT_STATS_KEY = 'web3CallCountStats'
const WEB3_CALL_COUNT_KEY = 'web3CallCount'

const GET_POOL_DATA_BATCH_SIZE = DEBUG_MODE
  ? 1
  : parseInt(process.env.GET_POOL_DATA_BATCH_SIZE || '15', 10)
const GET_VAULT_DATA_BATCH_SIZE = DEBUG_MODE
  ? 1
  : parseInt(process.env.GET_VAULT_DATA_BATCH_SIZE || '15', 10)

const DB_CACHE_IDS = {
  VAULTS: 0,
  POOLS: 1,
  STATS: 2,
  CMC: 3,
  UI_DATA: 4,
  EXTERNAL_API: 5,
}

const PROFIT_SHARING_POOL_ID = 'profit-sharing-farm'
const UNIV3_DAI_USDC_ID = 'UniV3_DAI_USDC'

const UI_DATA_FILES = {
  POOLS: 'pools',
  TOKENS: 'tokens',
}

module.exports = {
  WEB3_CALL_COUNT_STATS_KEY,
  WEB3_CALL_COUNT_KEY,
  GET_POOL_DATA_BATCH_SIZE,
  VENUS_API_URL,
  BSC_RPC_URL,
  CHAIN_TYPES,
  INFURA_URL,
  INFURA_WS_URL,
  COINGECKO_PRICE_API_ENDPOINT_CONTRACT,
  COINGECKO_PRICE_API_ENDPOINT_ID,
  API_KEY,
  APY_VISION_API_URL,
  APY_VISION_TOKEN,
  POOL_TYPES,
  GET_PRICE_TYPES,
  ESTIMATED_APY_TYPES,
  CORS_SETTINGS,
  UPDATE_LOOP_INTERVAL_MS,
  HEALTH_ALERT_TIME_MS,
  GENERAL_CACHE_TTL,
  MAIN_CACHE_KEYS,
  ENDPOINT_TYPES,
  ACTIVE_ENDPOINTS,
  HARVEST_LAUNCH_DATE,
  COMPOUND_CTOKEN_API_URL,
  GET_VAULT_DATA_BATCH_SIZE,
  SUSHI_POOLS_IDS,
  HISTORICAL_AVERAGE_PROFIT_SHARING_APY_ENDPOINT,
  CG_CACHE_TTL,
  COLLATERAL_TYPE,
  TOTAL_GAS_SAVED_ENDPOINT,
  BASIS_POOL_IDS,
  SUSHI_GRAPHQL_ENDPOINTS_TYPES,
  SUSHI_GRAPHQL_ENDPOINTS,
  BDO_API_URL,
  ELLIPSIS_API_URL,
  SWIRL_API_URL,
  BELT_API_URL,
  MSTABLE_API_URL,
  DEBUG_MODE,
  DB_CACHE_IDS,
  PROFIT_SHARING_POOL_ID,
  UNIV3_DAI_USDC_ID,
  MONTHLY_PROFITS_ENDPOINT,
  UI_DATA_FILES,
  UI_DATA_CACHE_TTL,
  MATIC_RPC_URL,
  TRADING_APY_TYPES,
  BALANCER_SUBGRAPH_URLS,
  LIDO_API_URLS,
  ROCKETPOOL_API_URLS,
  STAKEWISE_API_URLS,
  APE_API_URL,
}
