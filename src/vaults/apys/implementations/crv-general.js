const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const { cache } = require('../../../lib/cache')
const { getTokenPrice } = require('../../../prices')
const { COLLATERAL_TYPE, UI_DATA_FILES } = require('../../../lib/constants')
const { vault, crv, crvGauge, crvYPool, crvController } = require('../../../lib/web3/contracts')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { getUIData } = require('../../../lib/data')

const getApy = async (
  tokenSymbol,
  lendParams,
  gaugeAddress,
  swapAddress,
  collateralType,
  factor,
  addedTerm,
) => {
  const cachedApy = cache.get(`crvApy${tokenSymbol}`)

  if (cachedApy) {
    return cachedApy
  }

  const tokens = await getUIData(UI_DATA_FILES.TOKENS)

  const {
    contract: { abi: crvAbi },
    methods: { getRate },
  } = crv

  const {
    contract: {
      abi: crvControllerAbi,
      address: { mainnet: crvControllerAddress },
    },
    methods: crvControllerMethods,
  } = crvController

  const {
    contract: { abi: crvYPoolAbi },
    methods: crvYPoolInstanceMethods,
  } = crvYPool

  const {
    contract: { abi: crvGaugeAbi },
    methods: crvGaugeMethods,
  } = crvGauge

  const {
    contract: { abi: vaultAbi },
    methods: vaultMethods,
  } = vault

  const vaultAddress = tokens[tokenSymbol].vaultAddress

  const rewardTokenInstance = new web3.eth.Contract(crvAbi, tokenAddresses.CRV)

  const vaultInstance = new web3.eth.Contract(vaultAbi, vaultAddress)

  const gaugeInstance = new web3.eth.Contract(crvGaugeAbi, gaugeAddress)

  const crvYPoolInstance = new web3.eth.Contract(crvYPoolAbi, swapAddress)

  const crvControllerInstance = new web3.eth.Contract(crvControllerAbi, crvControllerAddress)

  const strategyAddress = await vaultMethods.getStrategy(vaultInstance)

  const currentRate = new BigNumber(await getRate(rewardTokenInstance))
    .multipliedBy(365 * 86400)
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  const rewardTokenInUsd = await getTokenPrice(tokenAddresses.CRV)

  const workingSupply = new BigNumber(await crvGaugeMethods.getWorkingSupply(gaugeInstance))

  const workingSupplyInUsd = workingSupply.dividedBy(new BigNumber(10).exponentiatedBy(18))

  const weight = new BigNumber(
    await crvControllerMethods.getGaugeRelativeWeight(gaugeAddress, crvControllerInstance),
  )

  const workingBalance = new BigNumber(
    await crvGaugeMethods.getWorkingBalance(strategyAddress, gaugeInstance),
  )

  const regularBalance = new BigNumber(
    await crvGaugeMethods.balanceOf(strategyAddress, gaugeInstance),
  )

  const virtualPrice = new BigNumber(
    await crvYPoolInstanceMethods.getVirtualPrice(crvYPoolInstance),
  )

  let basicApy = currentRate
      .multipliedBy(rewardTokenInUsd)
      .multipliedBy(weight)
      .multipliedBy(0.4) // a magic constant in curve.fi
      .dividedBy(workingSupplyInUsd)
      .dividedBy(virtualPrice)
      .multipliedBy(100), // 100%
    boost = 1

  if (regularBalance.gt(0)) {
    boost = workingBalance.dividedBy(0.4).dividedBy(regularBalance)
  }

  switch (collateralType) {
    case COLLATERAL_TYPE.BTC:
      basicApy = basicApy.dividedBy(await getTokenPrice(tokenAddresses.WBTC))
      break
    case COLLATERAL_TYPE.ETH:
      basicApy = basicApy.dividedBy(await getTokenPrice(tokenAddresses.WETH))
      break
    case COLLATERAL_TYPE.LP: {
      basicApy = basicApy.dividedBy(await getTokenPrice(tokenSymbol))
      break
    }
    default:
      break
  }

  const apyWithBoost = basicApy.multipliedBy(boost)

  if (!addedTerm) {
    addedTerm = 0
  }

  const result = apyWithBoost.plus(addedTerm).multipliedBy(factor).toString()
  cache.set(`crvApy${tokenSymbol}`, result)
  return result
}

module.exports = {
  getApy,
}
