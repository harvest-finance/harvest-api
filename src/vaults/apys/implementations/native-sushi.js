const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const tokenAddresses = require('../../../lib/data/addresses.json')

const {
  getOneDayBlock,
  getSushiFactoryStats,
  getSushiFactoryTimeTravel,
  getSushiBarStats,
} = require('../../../lib/third-party/sushi')

const { getAaveV2Market } = require('../../../lib/third-party/aave')
const { getTokenPrice } = require('../../../prices')

const getxSushiAPY = async () => {
  const oneDayBlockQueryReponse = await getOneDayBlock()
  const oneDayBlock = Number(get(oneDayBlockQueryReponse, 'blocks[0].number', 0))

  const sushiFactoryTimeTravelQueryReponse = await getSushiFactoryTimeTravel({
    block: {
      number: oneDayBlock,
    },
  })
  const sushiFactoryStatsQueryResponse = await getSushiFactoryStats()
  const sushiFactoryVolumeInUsd = get(sushiFactoryStatsQueryResponse, 'factory.volumeUSD', 0)

  const sushiFactoryTimeTravelVolumeInUSD = get(
    sushiFactoryTimeTravelQueryReponse,
    'factory.volumeUSD',
    0,
  )
  const oneDayVolume = new BigNumber(sushiFactoryVolumeInUsd).minus(
    sushiFactoryTimeTravelVolumeInUSD,
  )

  const sushiBarStatsQueryReponse = await getSushiBarStats()
  const sushiBarStats = get(sushiBarStatsQueryReponse, 'bar')

  const sushiPriceInUsd = await getTokenPrice(tokenAddresses.SUSHI)

  const apr = oneDayVolume
    .times(0.05)
    .times(0.01)
    .div(sushiBarStats.totalSupply)
    .times(365)
    .div(new BigNumber(sushiBarStats.ratio).times(sushiPriceInUsd))
    .div(365)
    .plus(1)

  const apy = apr.pow(365).minus(1)

  return apy.isNaN() ? '0' : apy.times(100).toFixed(2)
}

const getAaveAPY = async tokenSymbol => {
  const marketData = await getAaveV2Market()
  const marketReserves = get(marketData, 'reserves', [])

  let apy = 0

  if (marketReserves) {
    apy = new BigNumber(
      get(
        marketReserves.find(asset => asset.symbol === tokenSymbol),
        'liquidityRate',
        0,
      ),
    )
  }

  return apy.isNaN() ? '0' : apy.times(100).toFixed(2)
}

const getSushiHODLApy = async () => {
  const xSushiNativeAPY = new BigNumber(await getxSushiAPY()).times(0.85)
  const xSushiAaveAPY = new BigNumber(await getAaveAPY('XSUSHI'))

  const apy = xSushiNativeAPY.div(100).plus(1).times(xSushiAaveAPY.div(100).plus(1)).minus(1)

  return apy.isNaN() ? '0' : apy.times(100).toFixed(2)
}

module.exports = {
  getApy: getSushiHODLApy,
}
