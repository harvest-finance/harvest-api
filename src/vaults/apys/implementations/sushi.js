const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const tokenAddresses = require('../../../lib/data/addresses.json')
const sushiMasterContract = require('../../../lib/web3/contracts/sushi-masterchef/contract.json')
const sushiMasterContractMatic = require('../../../lib/web3/contracts/sushi-masterchef-matic/contract.json')
const {
  getPoolInfo: getPoolInfoSushi,
  getTotalAllocPoint: getTotalAllocPointSushi,
  getSushiPerBlock,
} = require('../../../lib/web3/contracts/sushi-masterchef/methods')
const {
  getSushiPerSecond,
  getSushiLpToken,
} = require('../../../lib/web3/contracts/sushi-masterchef-matic/methods')

const { CHAIN_TYPES } = require('../../../lib/constants')
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getSushiPoolWeight = async (poolInfo, sushiInstance) => {
  const totalAllocPoint = await getTotalAllocPointSushi(sushiInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, firstToken, secondToken, reduction, chain) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const selectedChain = chain
  const selectedWeb3 = getWeb3(selectedChain)
  const masterChefContract =
    selectedChain === CHAIN_TYPES.MATIC ? sushiMasterContractMatic : sushiMasterContract

  let apy,
    sushiPerBlock,
    sushiPerSecond,
    blocksPerYear,
    secondsPerYear,
    poolInfo = {}

  const sushiInstance = new selectedWeb3.eth.Contract(
    masterChefContract.abi,
    masterChefContract.address.mainnet,
  )

  if (selectedChain === CHAIN_TYPES.MATIC) {
    sushiPerSecond = new BigNumber(await getSushiPerSecond(sushiInstance)).dividedBy(
      new BigNumber(10).exponentiatedBy(18),
    )
    secondsPerYear = 31536000
    poolInfo = await getPoolInfoSushi(poolId, sushiInstance)
    poolInfo.lpToken = await getSushiLpToken(poolId, sushiInstance)
  } else {
    sushiPerBlock = new BigNumber(await getSushiPerBlock(sushiInstance)).dividedBy(
      new BigNumber(10).exponentiatedBy(18),
    )

    blocksPerYear = new BigNumber(2336000)
    poolInfo = await getPoolInfoSushi(poolId, sushiInstance)
  }

  const tokenInstance = new selectedWeb3.eth.Contract(abi, poolInfo.lpToken)
  const totalSupply = new BigNumber(
    await getBalance(masterChefContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const poolWeight = await getSushiPoolWeight(poolInfo, sushiInstance)

  const sushiPriceInUsd = await getTokenPrice(tokenAddresses.SUSHI)

  const lpTokenPrice = await getLPTokenPrice(poolInfo.lpToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  apy = new BigNumber(sushiPriceInUsd)

  if (selectedChain === CHAIN_TYPES.MATIC) {
    apy = apy.times(sushiPerSecond).times(secondsPerYear)
  } else {
    apy = apy.times(sushiPerBlock).times(blocksPerYear)
  }

  apy = apy.times(poolWeight).div(totalSupplyInUsd)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
