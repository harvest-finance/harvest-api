const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')
const { balTokenAdmin, crvGauge, crvController } = require('../../../lib/web3/contracts')
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
    contract: {
      abi: balTokenAdminAbi,
      address: { mainnet: balTokenAdminAddress },
    },
    methods: { getRate },
  } = balTokenAdmin

  const {
    contract: { abi: crvControllerAbi },
    methods: crvControllerMethods,
  } = crvController
  const balGaugeControllerAddress = '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD'

  const {
    contract: { abi: crvGaugeAbi },
    methods: crvGaugeMethods,
  } = crvGauge

  const balTokenAdminInstance = new web3Eth.eth.Contract(balTokenAdminAbi, balTokenAdminAddress)
  const crvControllerInstance = new web3Eth.eth.Contract(
    crvControllerAbi,
    balGaugeControllerAddress,
  )

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

  const currentRate = new BigNumber(await getRate(balTokenAdminInstance))
    .multipliedBy(365.25 * 86400)
    .dividedBy(new BigNumber(10).exponentiatedBy(18))

  const rewardTokenInUsd = await getTokenPrice(tokenAddresses.BAL)
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
