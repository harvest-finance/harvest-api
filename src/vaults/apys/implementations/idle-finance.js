const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')

const { UI_DATA_FILES } = require('../../../lib/constants')
const { getUIData } = require('../../../lib/data')
const { cache } = require('../../../lib/cache')

const uniswapContract = require('../../../lib/web3/contracts/uniswap/contract.json')
const uniswapMethods = require('../../../lib/web3/contracts/uniswap/methods')

const { idleLendingToken, idleController } = require('../../../lib/web3/contracts')
const { getApy: getCompoundAPY } = require('./compound.js')
const { getTokenPrice } = require('../../../prices')

const getIDLEPriceFromUniswapInWethWeis = async () => {
  const uniswapInstance = new web3.eth.Contract(
    uniswapContract.abi,
    uniswapContract.address.mainnet,
  )

  const result = await uniswapMethods.getAmountsOut(
    new BigNumber(10).pow(18).toString(),
    [tokenAddresses.IDLE, tokenAddresses.WETH],
    uniswapInstance,
  )

  const price = new BigNumber(result[1])

  return price.toString()
}

const getApy = async (
  tokenSymbol,
  idleLendingTokenAddress,
  compoundTokenAddress,
  isBtcLike,
  factor,
  lendApyOverride,
) => {
  const cachedApy = cache.get(`idleApy${tokenSymbol}`)

  if (cachedApy) {
    return cachedApy
  }

  const tokens = await getUIData(UI_DATA_FILES.TOKENS)

  const {
    contract: {
      abi: idleControllerAbi,
      address: { mainnet: idleControllerAddress },
    },
    methods: idleControllerMethods,
  } = idleController

  const {
    methods: { getTotalSupply, getVirtualPrice },
    contract: { abi: idleLendingTokenAbi },
  } = idleLendingToken

  const idleLendingTokenInstance = new web3.eth.Contract(
    idleLendingTokenAbi,
    idleLendingTokenAddress,
  )

  const idleControllerInstance = new web3.eth.Contract(idleControllerAbi, idleControllerAddress)

  const currentRate = new BigNumber(
    await idleControllerMethods.idleSpeeds(idleLendingTokenAddress, idleControllerInstance),
  )
    .multipliedBy(2371428) // blocks per year
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  const rewardTokenInUsd = new BigNumber(await getIDLEPriceFromUniswapInWethWeis())
    .multipliedBy(await getTokenPrice(tokenAddresses.WETH))
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  const totalSupply = new BigNumber(await getTotalSupply(idleLendingTokenInstance))

  const totalSupplyInUsd = totalSupply.dividedBy(new BigNumber(10).exponentiatedBy(18))

  const virtualPrice = new BigNumber(await getVirtualPrice(idleLendingTokenInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(tokens[tokenSymbol].decimals),
  )

  let basicApy = currentRate
    .multipliedBy(rewardTokenInUsd)
    .dividedBy(totalSupplyInUsd)
    .dividedBy(virtualPrice)
    .multipliedBy(100) // 100%

  if (isBtcLike) {
    basicApy = basicApy.dividedBy(await getTokenPrice(tokenAddresses.WBTC))
  }

  const lendApy = lendApyOverride
    ? lendApyOverride
    : await getCompoundAPY(compoundTokenAddress, false)

  const result = basicApy.multipliedBy(factor).plus(lendApy).toString()

  cache.set(`idleApy${tokenSymbol}`, result)
  return result
}

module.exports = {
  getApy,
}
