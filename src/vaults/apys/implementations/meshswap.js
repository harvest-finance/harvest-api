const BigNumber = require('bignumber.js')
const { web3MATIC } = require('../../../lib/web3')
const tokenAddresses = require('../../../../data/mainnet/addresses.json')
const meshswapViewContract = require('../../../lib/web3/contracts/meshswap-view/contract.json')
const { getPoolData } = require('../../../lib/web3/contracts/meshswap-view/methods')

const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getApy = async (lpAddress, reduction) => {
  const {
    methods: { getTotalSupply, getDecimals },
    contract: { abi },
  } = tokenContractData

  const meshTokenData = {
    blockAmount: 3.2,
    startBlock: 27853489,
    halfLife: 15768000,
  }

  const blocksPerYear = new BigNumber(15768000)

  let apy,
    poolData = {}

  const viewInstance = new web3MATIC.eth.Contract(
    meshswapViewContract.abi,
    meshswapViewContract.address.mainnet,
  )

  poolData = await getPoolData(lpAddress, viewInstance)

  const currentBlock = await web3MATIC.eth.getBlockNumber()

  let totalMeshRate = meshTokenData.blockAmount
  let meshHalvingBlock = meshTokenData.startBlock + meshTokenData.halfLife

  while (currentBlock > meshHalvingBlock) {
    totalMeshRate = totalMeshRate / 2
    meshHalvingBlock = meshHalvingBlock + meshTokenData.halfLife
  }
  const poolMeshWeight = new BigNumber(poolData.miningRate).div(poolData.rateDecimals).div(100)
  const poolMeshRate = new BigNumber(totalMeshRate).times(poolMeshWeight)

  let activeAirdrops = { tokens: [], blockAmounts: [] }
  if (poolData.airdropCount > 0) {
    for (let i = 0; i < poolData.airdropCount; i++) {
      if (
        Number(poolData.airdropSettings[i * 3 + 2]) > currentBlock &&
        currentBlock > Number(poolData.airdropSettings[i * 3 + 1])
      ) {
        activeAirdrops.tokens.push(poolData.airdropTokens[i])
        activeAirdrops.blockAmounts.push(new BigNumber(poolData.airdropSettings[i * 3]).div(1e18))
      }
    }
  }

  const tokenInstance = new web3MATIC.eth.Contract(abi, lpAddress)
  const decimals = await getDecimals(tokenInstance)
  const totalSupply = new BigNumber(await getTotalSupply(tokenInstance)).dividedBy(10 ** decimals)

  const meshPrice = await getTokenPrice(tokenAddresses.MATIC.MESH)

  const lpTokenPrice = await getTokenPrice(lpAddress)

  const totalSupplyInUsd = totalSupply.multipliedBy(lpTokenPrice)

  let rewardPerBlockInUsd = poolMeshRate.times(meshPrice)

  for (let i = 0; i < activeAirdrops.tokens.length; i++) {
    let tokenPrice = new BigNumber(await getTokenPrice(activeAirdrops.tokens[i]))
    rewardPerBlockInUsd = rewardPerBlockInUsd.plus(tokenPrice.times(activeAirdrops.blockAmounts[i]))
  }

  const rewardPerYear = rewardPerBlockInUsd.times(blocksPerYear)

  apy = rewardPerYear.div(totalSupplyInUsd)
  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }
  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
