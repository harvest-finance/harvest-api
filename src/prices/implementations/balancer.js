const BigNumber = require('bignumber.js')
const { get } = require('lodash')
const { web3, web3MATIC } = require('../../lib/web3')
const { getPoolInfo } = require('../../lib/third-party/balancer')
const { token: tokenContractData } = require('../../lib/web3/contracts')
const { CHAIN_TYPES } = require('../../lib/constants')

const getPrice = async (contractAddress, poolId, networkId) => {
  const {
    methods: { getTotalSupply },
    contract: { abi },
  } = tokenContractData

  let provider
  if (networkId == CHAIN_TYPES.ETH) {
    provider = web3
  } else if (networkId == CHAIN_TYPES.MATIC) {
    provider = web3MATIC
  }

  const poolInfo = await getPoolInfo(poolId, networkId)
  const tokenInstance = new provider.eth.Contract(abi, contractAddress)
  const totalSupply = new BigNumber(await getTotalSupply(tokenInstance)).dividedBy(
    new BigNumber(10).pow(18),
  )

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
