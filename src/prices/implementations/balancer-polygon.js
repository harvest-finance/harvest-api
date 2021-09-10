const BigNumber = require('bignumber.js')
const { get } = require('lodash')

const { web3MATIC } = require('../../lib/web3')
const { getPoolTokens } = require('../../lib/web3/contracts/balancer-vault/methods.js')
const { getTokenPrice } = require('../.')

const { token: tokenContractData } = require('../../lib/web3/contracts')
const balancerVaultContract = require('../../lib/web3/contracts/balancer-vault/contract.json')

const { CHAIN_TYPES } = require('../../lib/constants')

const getPrice = async (contractAddress, poolId) => {
  const {
    methods: { getTotalSupply, getDecimals },
    contract: { abi },
  } = tokenContractData
  const { abi: balancerVaultAbi, address: balancerVaultAddress } = balancerVaultContract

  const balancerVaultInstance = new web3MATIC.eth.Contract(
    balancerVaultAbi,
    balancerVaultAddress.mainnet,
  )
  let result = await getPoolTokens(poolId, balancerVaultInstance)
  let tokens = result.tokens
  let balances = result.balances
  let totalLiquidity = new BigNumber(0)
  for (let i=0; i<tokens.length; i++) {
    let token = tokens[i]
    let tokenInstance = new web3MATIC.eth.Contract(abi, token)
    let decimals = await getDecimals(tokenInstance)
    let balance = new BigNumber(balances[i]).div(new BigNumber(10).pow(decimals))
    let tokenPrice = await getTokenPrice(token, CHAIN_TYPES.MATIC)
    totalLiquidity = totalLiquidity.plus(balance.times(tokenPrice))
  }
  const lpTokenInstance = new web3MATIC.eth.Contract(abi, contractAddress)
  const totalSupply = new BigNumber(await getTotalSupply(lpTokenInstance)).dividedBy(
    new BigNumber(10).pow(18),
  )

  return totalLiquidity.dividedBy(totalSupply).toString()
}

module.exports = {
  getPrice,
}
