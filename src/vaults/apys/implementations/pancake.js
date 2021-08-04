const { web3BSC } = require('../../../lib/web3')
const BigNumber = require('bignumber.js')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const pancakeMasterContract = require('../../../lib/web3/contracts/pancake-masterchef/contract.json')
const {
  getPoolInfo: getPoolInfoPancake,
  getTotalAllocPoint: getTotalAllocPointPancake,
  getCakePerBlock,
} = require('../../../lib/web3/contracts/pancake-masterchef/methods')
const { getTokenPrice } = require('../../../prices')

const getPancakePoolWeight = async (poolInfo, pancakeInstance) => {
  const totalAllocPoint = await getTotalAllocPointPancake(pancakeInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, firstToken, secondToken, reduction) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const pancakeInstance = new web3BSC.eth.Contract(
    pancakeMasterContract.abi,
    pancakeMasterContract.address.mainnet,
  )

  const poolInfo = await getPoolInfoPancake(poolId, pancakeInstance)

  const tokenInstance = new web3BSC.eth.Contract(abi, poolInfo.lpToken)

  const poolWeight = await getPancakePoolWeight(poolInfo, pancakeInstance)

  const cakePerBlock = new BigNumber(await getCakePerBlock(pancakeInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )

  const blocksPerYear = new BigNumber(10512000)

  const cakePriceInUsd = await getTokenPrice('pancakeswap-token')

  const totalSupply = new BigNumber(
    await getBalance(pancakeMasterContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const lpTokenPrice =
    !firstToken && !secondToken
      ? cakePriceInUsd
      : await getLPTokenPrice(poolInfo.lpToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(cakePriceInUsd)
    .times(cakePerBlock)
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
