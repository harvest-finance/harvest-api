const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { getWeb3 } = require('../../lib/web3')
const { getPoolInfo } = require('../../lib/third-party/balancer')
const {
  balLpToken,
  balBoostLpToken,
  token: tokenContractData,
} = require('../../lib/web3/contracts')

const getPrice = async (contractAddress, poolId, networkId) => {
  const {
    methods: { getActualSupply },
    contract: { abi: lpTokenAbi },
  } = balLpToken
  const {
    methods: { getVirtualSupply },
    contract: { abi: lpBoostTokenAbi },
  } = balBoostLpToken
  const {
    methods: { getTotalSupply },
    contract: { abi: tokenAbi },
  } = tokenContractData

  const provider = getWeb3(networkId)

  const poolInfo = await getPoolInfo(poolId, networkId)

  let lpTokenInstance, totalSupply
  try {
    lpTokenInstance = new provider.eth.Contract(lpTokenAbi, contractAddress)
    totalSupply = new BigNumber(await getActualSupply(lpTokenInstance)).dividedBy(
      new BigNumber(1e18),
    )
  } catch (error) {
    try {
      lpTokenInstance = new provider.eth.Contract(lpBoostTokenAbi, contractAddress)
      totalSupply = new BigNumber(await getVirtualSupply(lpTokenInstance)).dividedBy(
        new BigNumber(1e18),
      )
    } catch (error) {
      lpTokenInstance = new provider.eth.Contract(tokenAbi, contractAddress)
      totalSupply = new BigNumber(await getTotalSupply(lpTokenInstance)).dividedBy(
        new BigNumber(1e18),
      )
    }
  }

  if (!get(poolInfo, 'totalLiquidity')) {
    console.error('Something went wrong with balancer api. totalLiquidity field is not avaiilable')
    return '0'
  } else {
    return new BigNumber(poolInfo.totalLiquidity).dividedBy(totalSupply).toString()
  }
}

module.exports = {
  getPrice,
}
