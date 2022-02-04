const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const { get } = require('lodash')
const { orderBy } = require('lodash')
const { cachedAxios } = require('../../../lib/db/models/cache')

const { STAKEWISE_API_URLS } = require('../../../lib/constants')

const { getTokenPrice } = require('../../../prices')
const { getPrice: getLpPrice } = require('../../../prices/implementations/lp-token.js')
const { getPosId } = require('../../../prices/implementations/uniswap-v3')

const {
  uniNonFungibleManager: uniNonFungibleContractData,
  token: tokenContract,
} = require('../../../lib/web3/contracts')
const swiseDistributionContract = require('../../../lib/web3/contracts/swise-distribution/contract.json')
const uniStatusViewerContractData = require('../../../lib/web3/contracts/unistatus-viewer/contract.json')
const { getAmountsForPosition } = require('../../../lib/web3/contracts/unistatus-viewer/methods')

const getApy = async (vaultAddress, lpAddress, factor) => {
  const {
    methods: { getPositions },
    contract,
  } = uniNonFungibleContractData

  const nonfungibleContractInstance = new web3.eth.Contract(contract.abi, contract.address.mainnet)

  const posId = await getPosId(vaultAddress, web3)
  const positionData = await getPositions(posId, nonfungibleContractInstance)

  const liquidityPercent = await getLiquidityPercent(positionData.liquidity, lpAddress)

  const lpPrice = await getLpPrice(vaultAddress, 'WETH', 'sETH2')
  const tvl = new BigNumber(lpPrice).times(positionData.liquidity).div(1e18)

  const rewardApr = await getRewardApr(liquidityPercent, tvl, lpAddress)

  const stakingApr = await getStakingApr(posId, positionData.token0, positionData.token1)

  return rewardApr.plus(stakingApr).times(factor).toFixed()
}

const getLiquidityPercent = async (posLiquidity, lpAddress) => {
  let totalLiquidity
  try {
    const response = await cachedAxios.get(STAKEWISE_API_URLS.LIQUIDITY)

    totalLiquidity = get(
      get(response, 'data', []).find(pool => pool.contract_address === lpAddress),
      'current_tick_liquidity',
      0,
    )

    totalLiquidity = new BigNumber(totalLiquidity)
  } catch (err) {
    console.error('Stakewise API error: ', err)
    totalLiquidity = new BigNumber(0)
    return new BigNumber(0)
  }

  const positionLiquidity = new BigNumber(posLiquidity)

  return positionLiquidity.div(totalLiquidity).times(100)
}

const getRewardApr = async (liquidityPercent, tvl, lpAddress) => {
  const swiseDistributionInstance = new web3.eth.Contract(
    swiseDistributionContract.abi,
    swiseDistributionContract.address.mainnet,
  )

  const distributionEvents = orderBy(
    (
      await swiseDistributionInstance.getPastEvents('PeriodicDistributionAdded', {
        filter: { beneficiary: lpAddress },
        fromBlock: 12651371, //start of distribution
        toBlock: 'latest',
      })
    ).concat(
      await swiseDistributionInstance.getPastEvents('DistributionAdded', {
        filter: { beneficiary: lpAddress },
        fromBlock: 12651371, //start of distribution
        toBlock: 'latest',
      }),
    ),
    'blockNumber',
    'desc',
  )

  const lastDistribution = distributionEvents[0]
  const swiseAddress = lastDistribution.returnValues.token
  const swisePrice = await getTokenPrice(swiseAddress)
  const swiseAmount = new BigNumber(lastDistribution.returnValues.amount).div(1e18)
  const durationBlocks = new BigNumber(lastDistribution.returnValues.endBlock).minus(
    lastDistribution.returnValues.startBlock,
  )
  const blocksPerYear = new BigNumber(2336000)

  const yearlyRewardsInUsd = new BigNumber(swisePrice)
    .times(swiseAmount)
    .times(blocksPerYear)
    .div(durationBlocks)
  const ourRewardsInUsd = yearlyRewardsInUsd.times(liquidityPercent).div(100)
  const apr = ourRewardsInUsd.div(tvl).times(100)
  return apr
}

const getStakingApr = async (posId, token0, token1) => {
  const seth2Address = '0xFe2e637202056d30016725477c5da089Ab0A043A'
  const viewerContractInstance = new web3.eth.Contract(
    uniStatusViewerContractData.abi,
    uniStatusViewerContractData.address.mainnet,
  )
  const amountsForPosition = await getAmountsForPosition(posId, viewerContractInstance)

  const token0Amount = new BigNumber(amountsForPosition[0])
  const token1Amount = new BigNumber(amountsForPosition[1])
  const token0Price = await getTokenPrice(token0)
  const token1Price = await getTokenPrice(token1)
  const token0Value = token0Amount.times(token0Price).div(1e18)
  const token1Value = token1Amount.times(token1Price).div(1e18)

  let seth2Fraction
  if (token0 == seth2Address) {
    seth2Fraction = token0Value.div(token0Value.plus(token1Value))
  } else {
    seth2Fraction = token1Value.div(token0Value.plus(token1Value))
  }

  let activatedValidators, validatorApr
  try {
    const response = await cachedAxios.get(STAKEWISE_API_URLS.STAKING)

    activatedValidators = get(response, 'data.activated_validators', 0)
    validatorApr = get(response, 'data.validators_apr', 0)
  } catch (err) {
    console.error('Stakewise API error: ', err)
    activatedValidators = 0
    validatorApr = 0
    return 0
  }
  const totalStaked = new BigNumber(activatedValidators).times(32)

  const {
    methods: { getTotalSupply },
    contract,
  } = tokenContract

  const seth2Instance = new web3.eth.Contract(contract.abi, seth2Address)

  const seth2TotalSupply = await getTotalSupply(seth2Instance)
  const utilisation = totalStaked.times(1e18).div(seth2TotalSupply)
  const stakingApr = new BigNumber(validatorApr).times(utilisation).times(0.9).times(seth2Fraction)
  return stakingApr
}

module.exports = {
  getApy,
}
