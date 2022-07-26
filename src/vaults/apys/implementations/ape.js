const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')
const getLPTokenPrice = require('../../../prices/implementations/lp-token.js').getPrice
const tokenAddresses = require('../../../../data/mainnet/addresses.json')
const masterChefContract = require('../../../lib/web3/contracts/ape-masterchef/contract.json')
const {
  getBananaPerSecond,
  getBananaLpToken,
  getTotalAllocPoint,
  getPoolInfo,
} = require('../../../lib/web3/contracts/ape-masterchef/methods.js')

const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getBananaPoolWeight = async (poolInfo, bananaInstance) => {
  const totalAllocPoint = await getTotalAllocPoint(bananaInstance)

  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint))
}

const getApy = async (poolId, firstToken, secondToken, reduction, chain) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const selectedWeb3 = getWeb3(chain)

  let apy,
    bananaPerSecond,
    secondsPerYear,
    poolInfo = {}

  const bananaInstance = new selectedWeb3.eth.Contract(
    masterChefContract.abi,
    masterChefContract.address.mainnet,
  )

  bananaPerSecond = new BigNumber(await getBananaPerSecond(bananaInstance)).dividedBy(
    new BigNumber(10).exponentiatedBy(18),
  )
  secondsPerYear = 31536000
  poolInfo = await getPoolInfo(poolId, bananaInstance)
  poolInfo.lpToken = await getBananaLpToken(poolId, bananaInstance)
  const tokenInstance = new selectedWeb3.eth.Contract(abi, poolInfo.lpToken)
  const totalSupply = new BigNumber(
    await getBalance(masterChefContract.address.mainnet, tokenInstance),
  ).dividedBy(new BigNumber(10).exponentiatedBy(18))

  const poolWeight = await getBananaPoolWeight(poolInfo, bananaInstance)

  const bananaPriceInUsd = await getTokenPrice(tokenAddresses.MATIC.BANANA)

  const lpTokenPrice = await getLPTokenPrice(poolInfo.lpToken, firstToken, secondToken)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  apy = new BigNumber(bananaPriceInUsd)

  apy = apy.times(bananaPerSecond).times(secondsPerYear)

  apy = apy.times(poolWeight).div(totalSupplyInUsd)

  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
