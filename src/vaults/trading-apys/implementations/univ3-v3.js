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

const { UI_DATA_FILES } = require('../../../lib/constants')
const {
  methods: { getUnderlyingBalanceWithInvestment },
  contract: { abi },
} = vaultContractData

// fromBlock = 12429930: It was the earliest block when Uniswap V3 vaults were deployed
const getTradingApy = async (vaultAddress, symbol, fromBlock = 12429930, toBlock = 'latest') => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const vaultData = tokens[symbol]
  const vaultInstance = new web3Socket.eth.Contract(abi, vaultData.vaultAddress)
  const underlyingBalanceWithInvestment = await getUnderlyingBalanceWithInvestment(vaultInstance)
  const usdPrice = (await getTokenPrice(symbol)).toString()
  const totalValueLocked = new BigNumber(underlyingBalanceWithInvestment)
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

  let yearlyApy = 0,
    dailyAPR = 0
  const startTimestamp =
    (lastHarvest && lastHarvest.timestamp) ||
    (await web3.eth.getBlock(liquidityChangeEvents[0].blockNumber)).timestamp

  if (liquidityChangeEvents.length > 0) {
    const lastLiquidityChange = liquidityChangeEvents[liquidityChangeEvents.length - 1]
    const lastLiquidityChangeTimestamp = (await web3.eth.getBlock(lastLiquidityChange.blockNumber))
      .timestamp
    const secondsElapsed = lastLiquidityChangeTimestamp - startTimestamp

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

    dailyAPR = ((3600 * 24 * totalRewards) / totalValueLocked / secondsElapsed) * 100
  } else if (vaultEvents.length > 0) {
    const {
      returnValues: { newPrice, oldPrice, newTimestamp, previousTimestamp },
    } = lastHarvest
    dailyAPR =
      ((3600 * 24 * BigNumber(newPrice).minus(oldPrice)) /
        newPrice /
        (newTimestamp - previousTimestamp)) *
      100
  }

  yearlyApy = (Math.pow(1 + dailyAPR / 100, 365) - 1) * 100
  return Number.isNaN(yearlyApy) ? '0' : yearlyApy.toString()
}
const getDecimals = async tokenAddress => {
  const instance = new web3Socket.eth.Contract(tokenContract.contract.abi, tokenAddress)
  const decimals = await tokenContract.methods.getDecimals(instance)
  return decimals
}

module.exports = {
  getTradingApy,
}
