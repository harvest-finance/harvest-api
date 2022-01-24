const { web3BSC, web3MATIC } = require('../../../lib/web3')
const BigNumber = require('bignumber.js')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const popsicleMasterContract = require('../../../lib/web3/contracts/popsicle-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoPopsicle,
  getTotalAllocPoint: getTotalAllocPointPopsicle,
  getIcePerSecond,
} = require('../../../lib/web3/contracts/popsicle-masterchef/methods')
const { getTokenPrice } = require('../../../prices')
const { CHAIN_TYPES } = require('../../../lib/constants')

const getPopsiclePoolWeight = async (poolInfo, popsicleInstance) => {
  const totalAllocPoint = await getTotalAllocPointPopsicle(popsicleInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const popsicleMaticMasterchefAddress = '0xbf513aCe2AbDc69D38eE847EFFDaa1901808c31c'
const getApy = async (poolId, firstToken, secondToken, reduction, networkId) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  let provider, contractAddress
  if (networkId == CHAIN_TYPES.BSC) {
    provider = web3BSC
    contractAddress = popsicleMasterContract.address.mainnet
  } else if (networkId == CHAIN_TYPES.MATIC) {
    provider = web3MATIC
    contractAddress = popsicleMaticMasterchefAddress
  }
  const icePriceInUsd = await getTokenPrice('ice-token')

  const popsicleInstance = new provider.eth.Contract(popsicleMasterContract.abi, contractAddress)

  const poolInfo = await getPoolInfoPopsicle(poolId, popsicleInstance)

  const tokenInstance = new provider.eth.Contract(abi, poolInfo.stakingToken)

  const poolWeight = await getPopsiclePoolWeight(poolInfo, popsicleInstance)

  const icePerSecond = new BigNumber(await getIcePerSecond(popsicleInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )

  const secondsPerYear = new BigNumber(31557600)

  const totalSupply = new BigNumber(
    await getBalance(popsicleMasterContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const lpTokenPrice =
    !firstToken && !secondToken
      ? icePriceInUsd
      : await getLPTokenPrice(poolInfo.stakingToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(icePriceInUsd)
    .times(icePerSecond)
    .times(secondsPerYear)
    .times(poolWeight)
    .div(totalSupplyInUsd)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}
module.exports = {
  getApy,
}
