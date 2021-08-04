const BigNumber = require('bignumber.js')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const tokenAddresses = require('../../../lib/data/addresses.json')

const spaceMasterContract = require('../../../lib/web3/contracts/space-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoSpace,
  getTotalAllocPoint: getTotalAllocPointSpace,
  getSpacePerBlock,
} = require('../../../lib/web3/contracts/space-masterchef/methods')

const { token: tokenContractData } = require('../../../lib/web3/contracts')

const { web3BSC } = require('../../../lib/web3')

const getTokenPriceFromPancakeSwapPair = require('../../../prices/implementations/pancakeswap-pair.js')
  .getPrice

const getSpacePoolWeight = async (poolInfo, spaceInstance) => {
  const totalAllocPoint = await getTotalAllocPointSpace(spaceInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, firstToken, secondToken, reduction) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const spacePriceInUsd = await getTokenPriceFromPancakeSwapPair(tokenAddresses.BSC.SPACE)

  const spaceInstance = new web3BSC.eth.Contract(
    spaceMasterContract.abi,
    spaceMasterContract.address.mainnet,
  )

  const poolInfo = await getPoolInfoSpace(poolId, spaceInstance)

  const tokenInstance = new web3BSC.eth.Contract(abi, poolInfo.lpToken)

  const poolWeight = await getSpacePoolWeight(poolInfo, spaceInstance)

  const spacePerBlock = new BigNumber(await getSpacePerBlock(spaceInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )

  const blocksPerYear = new BigNumber(10512000)

  const totalSupply = new BigNumber(
    await getBalance(spaceMasterContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const lpTokenPrice =
    !firstToken && !secondToken
      ? spacePriceInUsd
      : await getLPTokenPrice(poolInfo.lpToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(spacePriceInUsd)
    .times(spacePerBlock)
    .times(blocksPerYear)
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
