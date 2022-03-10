const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')
const { crv, crvGauge, crvController } = require('../../../lib/web3/contracts')
const tokenAddresses = require('../../../lib/data/addresses.json')

const getApy = async (
  tokenSymbol,
  gaugeAddress,
  swapAddress,
  factor,
  chain = CHAIN_TYPES.ETH,
  rootChainGaugeAddress,
) => {
  const web3Eth = getWeb3(CHAIN_TYPES.ETH)
  let web3Polygon
  if (chain != CHAIN_TYPES.ETH) {
    web3Polygon = getWeb3(CHAIN_TYPES.MATIC)
  }

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
    contract: { abi: crvGaugeAbi },
    methods: crvGaugeMethods,
  } = crvGauge

  const rewardTokenInstance = new web3Eth.eth.Contract(crvAbi, tokenAddresses.CRV)
  const crvControllerInstance = new web3Eth.eth.Contract(crvControllerAbi, crvControllerAddress)

  let gaugeInstance, weight
  if (chain == CHAIN_TYPES.ETH) {
    gaugeInstance = new web3Eth.eth.Contract(crvGaugeAbi, gaugeAddress)
    weight = new BigNumber(
      await crvControllerMethods.getGaugeRelativeWeight(gaugeAddress, crvControllerInstance),
    ).dividedBy(new BigNumber(10).exponentiatedBy(18))
  } else {
    gaugeInstance = new web3Polygon.eth.Contract(crvGaugeAbi, gaugeAddress)
    weight = new BigNumber(
      await crvControllerMethods.getGaugeRelativeWeight(
        rootChainGaugeAddress,
        crvControllerInstance,
      ),
    ).dividedBy(new BigNumber(10).exponentiatedBy(18))
  }

  const currentRate = new BigNumber(await getRate(rewardTokenInstance))
    .multipliedBy(365.25 * 86400)
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  const rewardTokenInUsd = await getTokenPrice(tokenAddresses.CRV)

  const totalSupply = new BigNumber(await crvGaugeMethods.getTotalSupply(gaugeInstance))

  const lpTokenPrice = new BigNumber(await getTokenPrice(tokenSymbol, chain))

  const totalSupplyInUsd = totalSupply
    .dividedBy(new BigNumber(10).exponentiatedBy(18))
    .times(lpTokenPrice)

  let apy = currentRate
    .multipliedBy(rewardTokenInUsd)
    .multipliedBy(weight)
    .dividedBy(totalSupplyInUsd)
    .multipliedBy(100) // 100%

  const result = apy.multipliedBy(factor).toFixed(2, 1)
  return result
}

module.exports = {
  getApy,
}
