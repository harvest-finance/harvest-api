const BigNumber = require('bignumber.js')
const { get } = require('lodash')

const { web3 } = require('../../lib/web3')
const { getPoolTokens } = require('../../lib/web3/balancer/methods.js')
const { getTokenPrice } = require('../../../prices')

const { token: tokenContractData } = require('../../lib/web3/contracts')
const balancerVaultContract = require('../../../lib/web3/contracts/balancer-vault/contract.json')

const getPrice = async (contractAddress, poolId) => {
  const {
    methods: { getTotalSupply, getDecimals },
    contract: { abi },
  } = tokenContractData
  const { abi: balancerVaultAbi, address: balancerVaultAddress } = universeStakingContract

  const balancerVaultInstance = new web3.eth.Contract(
    balancerVaultAbi,
    balancerVaultAddress.mainnet,
  )

  const (tokens, balances, lastChangeBlock) = await getPoolTokens(poolId, balancerVaultInstance)
  let totalLiquidity = new BigNumber(0)
  for (let i=0; i<tokens.length; i++) {
    let token = tokens[i]
    let tokenInstance = new web3.eth.Contract(abi, token)
    let decimals = await getDecimals(tokenInstance)
    let balance = new BigNumber(balances[i]).div(new BigNumber(10).pow(decimals))
    let tokenPrice = new BigNumber(getTokenPrice(token))
    totalLiquidity = totalLiquidity.plus(balance.times(tokenPrice))
  }

  const lpTokenInstance = new web3.eth.Contract(abi, contractAddress)
  const totalSupply = new BigNumber(await getTotalSupply(lpTokenInstance)).dividedBy(
    new BigNumber(10).pow(18),
  )

  return totalLiquidity.dividedBy(totalSupply).toString()
}

module.exports = {
  getPrice,
}
