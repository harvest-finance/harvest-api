const { web3BSC } = require('../../../lib/web3')
const BigNumber = require('bignumber.js')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const gooseMasterContract = require('../../../lib/web3/contracts/goose-masterchef/contract.json')
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const {
  getPoolInfo: getPoolInfoGoose,
  getTotalAllocPoint: getTotalAllocPointGoose,
  getEggPerBlock,
} = require('../../../lib/web3/contracts/goose-masterchef/methods')
const { getTokenPrice } = require('../../../prices')

const getGoosePoolWeight = async (poolInfo, gooseInstance) => {
  const totalAllocPoint = await getTotalAllocPointGoose(gooseInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, firstToken, secondToken, reduction) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const gooseInstance = new web3BSC.eth.Contract(
    gooseMasterContract.abi,
    gooseMasterContract.address.mainnet,
  )

  const poolInfo = await getPoolInfoGoose(poolId, gooseInstance)

  const tokenInstance = new web3BSC.eth.Contract(abi, poolInfo.lpToken)

  const poolWeight = await getGoosePoolWeight(poolInfo, gooseInstance)

  const eggPerBlock = new BigNumber(await getEggPerBlock(gooseInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )

  const blocksPerYear = new BigNumber(10541200)

  const eggPriceInUsd = await getTokenPrice('goose-finance')

  const totalSupply = new BigNumber(
    await getBalance(gooseMasterContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const lpTokenPrice =
    !firstToken && !secondToken
      ? eggPriceInUsd
      : await getLPTokenPrice(poolInfo.lpToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let apy = new BigNumber(eggPriceInUsd)
    .times(eggPerBlock)
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
