const { orderBy } = require('lodash')
const { web3, web3Socket } = require('../../../lib/web3')

const uniNonFungibleContractData = require('../../../lib/web3/contracts/uni-non-fungible-manager/contract.json')
const univ3EventsContract = require('../../../lib/web3/contracts/uniswap-v3-sharepriceEvents/contract.json')
const { vault: vaultContractData, token: tokenContract } = require('../../../lib/web3/contracts')
const { getPositions } = require('../../../lib/web3/contracts/uni-non-fungible-manager/methods')
const { getTokenPrice } = require('../../../prices')
const { getPosId } = require('../../../prices/implementations/uniswap-v3')
const { default: BigNumber } = require('bignumber.js')
const { getUIData } = require('../../../lib/data')
const { getTradingApy: getTradingApyV1 } = require('./univ3')
const { UI_DATA_FILES } = require('../../../lib/constants')
const {
  methods: { getUnderlyingBalanceWithInvestment },
  contract: { abi },
} = vaultContractData

const oldVaultImplementations = ['0x3833b631B454AE659a2Ca11104854823009969D4']

// fromBlock = 12429930: It was the earliest block when Uniswap V3 vaults were deployed
const getTradingApy = async (
  vaultAddress,
  symbol,
  stratPercentFactor,
  fromBlock = 12429930,
  toBlock = 'latest',
) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const vaultData = tokens[symbol]
  const vaultInstance = new web3Socket.eth.Contract(abi, vaultData.vaultAddress)

  const vaultImplementation = await vaultInstance.methods.implementation().call()
  if (oldVaultImplementations.includes(vaultImplementation)) {
    return getTradingApyV1(vaultAddress, fromBlock, toBlock)
  }

  const underlyingBalanceWithInvestment = await getUnderlyingBalanceWithInvestment(vaultInstance)
  const usdPrice = (await getTokenPrice(symbol)).toString()
  let totalValueLocked = new BigNumber(underlyingBalanceWithInvestment)
    .multipliedBy(usdPrice)
    .dividedBy(new BigNumber(10).exponentiatedBy(Number(vaultData.decimals)))
    .decimalPlaces(6)

  const instance = new web3Socket.eth.Contract(univ3EventsContract.abi, vaultAddress)
  const vaultEvents = (
    await instance.getPastEvents('SharePriceChangeTrading', {
      fromBlock,
      toBlock,
    })
  ).map(event => ({
    blockNumber: event.blockNumber,
    timestamp: +event.returnValues.newTimestamp,
    returnValues: event.returnValues,
  }))

  const nonfungibleContractInstance = new web3.eth.Contract(
    uniNonFungibleContractData.abi,
    uniNonFungibleContractData.address.mainnet,
  )
  const lastHarvest = vaultEvents[vaultEvents.length - 1]

  const posId = await getPosId(vaultAddress, web3)

  const liquidityChangeEvents = orderBy(
    (
      await nonfungibleContractInstance.getPastEvents('DecreaseLiquidity', {
        filter: { tokenId: posId },
        fromBlock: (lastHarvest && lastHarvest.blockNumber) || fromBlock,
        toBlock,
      })
    ).concat(
      await nonfungibleContractInstance.getPastEvents('IncreaseLiquidity', {
        filter: { tokenId: posId },
        fromBlock: (lastHarvest && lastHarvest.blockNumber) || fromBlock,
        toBlock,
      }),
    ),
    'blockNumber',
    'asc',
  )

  let dailyAPR = 0,
    timeWeightedTvl

  if (liquidityChangeEvents.length > 0) {
    const startTimestamp =
      (lastHarvest && lastHarvest.timestamp) ||
      (await web3.eth.getBlock(liquidityChangeEvents[0].blockNumber)).timestamp

    const lastLiquidityChange = liquidityChangeEvents[liquidityChangeEvents.length - 1]
    const lastLiquidityChangeTimestamp = (await web3.eth.getBlock(lastLiquidityChange.blockNumber))
      .timestamp
    const secondsElapsed = lastLiquidityChangeTimestamp - startTimestamp

    if (secondsElapsed == 0 && !!lastHarvest) {
      dailyAPR = getAprForLastHarvest(lastHarvest, stratPercentFactor)
      return getYearlyApy(dailyAPR)
    }
    const { token0, token1, tokensOwed0, tokensOwed1 } = await getPositions(
      posId,
      nonfungibleContractInstance,
    )

    const token0Price = (await getTokenPrice(token0)).toString()
    const token1Price = (await getTokenPrice(token1)).toString()
    const token0Decimals = +(await getDecimals(token0))
    const token1Decimals = +(await getDecimals(token1))

    const rewardsToken0 = BigNumber(tokensOwed0)
      .dividedBy(10 ** token0Decimals)
      .multipliedBy(token0Price)
    const rewardsToken1 = BigNumber(tokensOwed1)
      .dividedBy(10 ** token1Decimals)
      .multipliedBy(token1Price)
    const totalRewards = +BigNumber(rewardsToken0).plus(rewardsToken1).decimalPlaces(6)
    const getTvlChangeFromLCE = liquidityChangeEvent => {
      const {
        returnValues: { amount0, amount1 },
        event,
      } = liquidityChangeEvent
      const sign = getSign(event)
      const valueToken0 = BigNumber(amount0)
        .dividedBy(10 ** token0Decimals)
        .multipliedBy(token0Price)
      const valueToken1 = BigNumber(amount1)
        .dividedBy(10 ** token1Decimals)
        .multipliedBy(token1Price)
      const totalRewards = +BigNumber(valueToken0)
        .plus(valueToken1)
        .multipliedBy(sign)
        .decimalPlaces(6)
      return totalRewards
    }

    if (liquidityChangeEvents.length > 1) {
      let parsedEvents = liquidityChangeEvents
        .map(event => {
          return {
            blockNumber: event.blockNumber,
            tvlChange: getTvlChangeFromLCE(event),
          }
        })
        .filter(event => event.blockNumber !== (lastHarvest && lastHarvest.blockNumber))

      const totalTvlChange = parsedEvents.reduce((sum, event) => sum + event.tvlChange, 0)
      const startTvl = totalValueLocked.minus(totalTvlChange)

      var timedTvls = await parsedEvents.reduce(
        async (acc, event, index) => {
          const currentTimestamp = (await web3.eth.getBlock(event.blockNumber)).timestamp
          if (index === 0) {
            const result = [{ tvl: startTvl, elapsed: currentTimestamp - startTimestamp }]
            return {
              result,
              tvl: startTvl,
              prev: event,
              prevTimestamp: currentTimestamp,
            }
          }

          const { result, tvl, prev, prevTimestamp } = await acc
          const newTvl = BigNumber(tvl).plus(prev.tvlChange)

          return {
            result: [...result, { tvl: tvl, elapsed: currentTimestamp - prevTimestamp }],
            tvl: newTvl,
            prev: event,
            prevTimestamp: currentTimestamp,
          }
        },
        { result: [] },
      )

      timeWeightedTvl = timedTvls.result
        .map(item => {
          return BigNumber(item.tvl).multipliedBy(item.elapsed)
        })
        .reduce((sum, x) => sum.plus(x))
        .dividedBy(secondsElapsed)
    }

    totalValueLocked = timeWeightedTvl || totalValueLocked
    dailyAPR = BigNumber(
      ((3600 * 24 * totalRewards) / totalValueLocked / secondsElapsed) * 100,
    ).times(stratPercentFactor)
  } else if (vaultEvents.length > 0) {
    dailyAPR = getAprForLastHarvest(lastHarvest)
  }

  return getYearlyApy(dailyAPR)
}

const getSign = liquidityChangeEventType => {
  let eventTypes = {
    IncreaseLiquidity: 1,
    DecreaseLiquidity: -1,
    default: 1,
  }
  return eventTypes[liquidityChangeEventType] || eventTypes['default']
}
const getYearlyApy = dailyAPR => {
  const yearlyApy = (Math.pow(1 + dailyAPR / 100, 365) - 1) * 100
  return Number.isNaN(yearlyApy) ? '0' : yearlyApy.toString()
}

const getAprForLastHarvest = (lastHarvest, stratPercentFactor) => {
  const {
    returnValues: { newPrice, oldPrice, newTimestamp, previousTimestamp },
  } = lastHarvest
  return BigNumber(
    ((3600 * 24 * BigNumber(newPrice).minus(oldPrice)) /
      newPrice /
      (newTimestamp - previousTimestamp)) *
      100,
  ).times(stratPercentFactor)
}

const getDecimals = async tokenAddress => {
  const instance = new web3Socket.eth.Contract(tokenContract.contract.abi, tokenAddress)
  const decimals = await tokenContract.methods.getDecimals(instance)
  return decimals
}

module.exports = {
  getTradingApy,
}
