const BigNumber = require('bignumber.js')
const { get } = require('lodash')

const { web3 } = require('../../lib/web3')
const { getPoolInfo } = require('../../lib/third-party/balancer')

const { token: tokenContractData } = require('../../lib/web3/contracts')

const getPrice = async (contractAddress, poolId) => {
  const {
    methods: { getTotalSupply },
    contract: { abi },
  } = tokenContractData

  const poolInfo = await getPoolInfo(poolId)
  const tokenInstance = new web3.eth.Contract(abi, contractAddress)
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
