/* eslint-disable for-direction */
const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const tokenAddresses = require('../../../lib/data/addresses.json')

const controllerContract = require('../../../lib/web3/contracts/idle-gauge-controller/contract.json')
const distributorContract = require('../../../lib/web3/contracts/idle-gauge-distributor/contract.json')
const liquidityGaugeContract = require('../../../lib/web3/contracts/idle-liquidity-gauge/contract.json')
const multiRewardContract = require('../../../lib/web3/contracts/idle-multi-reward/contract.json')
const trancheCDOContract = require('../../../lib/web3/contracts/idle-cdo/contract.json')
const wstethContract = require('../../../lib/web3/contracts/lido-wsteth/contract.json')

const { gaugeRelativeWeight } = require('../../../lib/web3/contracts/idle-gauge-controller/methods')
const { rate } = require('../../../lib/web3/contracts/idle-gauge-distributor/methods')
const {
  rewardContract,
  totalSupply,
} = require('../../../lib/web3/contracts/idle-liquidity-gauge/methods')
const { rewardData } = require('../../../lib/web3/contracts/idle-multi-reward/methods')
const { priceAA } = require('../../../lib/web3/contracts/idle-cdo/methods')
const { stEthPerToken } = require('../../../lib/web3/contracts/lido-wsteth/methods')

const { getTokenPrice } = require('../../../prices')

const ONE_YEAR = new BigNumber(3600 * 24 * 365)

const getApy = async (
  trancheCDO,
  liquidityGauge,
  rewardTokens,
  underlyingToken,
  iswstETH,
  reduction,
) => {
  const controllerInstance = new web3.eth.Contract(
    controllerContract.abi,
    controllerContract.address.mainnet,
  )
  const distributorInstance = new web3.eth.Contract(
    distributorContract.abi,
    distributorContract.address.mainnet,
  )
  const liquidityGaugeInstance = new web3.eth.Contract(liquidityGaugeContract.abi, liquidityGauge)
  const trancheCDOInstance = new web3.eth.Contract(trancheCDOContract.abi, trancheCDO)

  const weight = await gaugeRelativeWeight(liquidityGauge, controllerInstance)
  const idleRate = await rate(distributorInstance)
  const idleForGaugePerYear = new BigNumber(idleRate)
    .multipliedBy(ONE_YEAR)
    .multipliedBy(new BigNumber(weight))
    .dividedBy(new BigNumber(1e18)) // weight decimal
    .dividedBy(new BigNumber(1e18)) // idle token decimal
  const idlePrice = await getTokenPrice(tokenAddresses.IDLE)
  const idleValuePerYear = new BigNumber(idlePrice).multipliedBy(idleForGaugePerYear)

  let rewardValuePerYear = new BigNumber(0)
  if (rewardTokens.length > 0) {
    const rewardContractAddr = await rewardContract(liquidityGaugeInstance)
    const rewardInstance = new web3.eth.Contract(multiRewardContract.abi, rewardContractAddr)

    for (let i = 0; i < rewardTokens.length; i++) {
      const data = await rewardData(rewardTokens[i], rewardInstance)
      const tokenPrice = await getTokenPrice(rewardTokens[i])
      const value = new BigNumber(data.rewardRate)
        .multipliedBy(new BigNumber(tokenPrice))
        .multipliedBy(ONE_YEAR)
        .dividedBy(new BigNumber(1e18)) // token decimal
      rewardValuePerYear = rewardValuePerYear.plus(value)
    }
  }

  const trancheSupply = await totalSupply(liquidityGaugeInstance)
  const AATranchePrice = await priceAA(trancheCDOInstance)
  let trancheBalancePerUnderlying = new BigNumber(1e18).dividedBy(new BigNumber(AATranchePrice))
  if (iswstETH) {
    const wstETHInstance = new web3.eth.Contract(wstethContract.abi, wstethContract.address.mainnet)
    const stethPerToken = await stEthPerToken(wstETHInstance)
    trancheBalancePerUnderlying = trancheBalancePerUnderlying.multipliedBy(
      new BigNumber(stethPerToken),
    )
  }

  const underlyingPrice = await getTokenPrice(underlyingToken)
  let apy = idleValuePerYear
    .plus(rewardValuePerYear)
    .multipliedBy(trancheBalancePerUnderlying)
    .dividedBy(trancheSupply)
    .dividedBy(underlyingPrice)
  apy = apy.multipliedBy(new BigNumber(90)).dividedBy(new BigNumber(100)) //10% performance fee

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
