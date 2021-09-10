const BigNumber = require('bignumber.js')

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
  let result = await getPoolTokens(poolId, balancerVaultInstance),
    tokens = result.tokens,
    balances = result.balances,
    totalLiquidity = new BigNumber(0)
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i],
      tokenInstance = new web3MATIC.eth.Contract(abi, token),
      decimals = await getDecimals(tokenInstance),
      balance = new BigNumber(balances[i]).div(new BigNumber(10).pow(decimals)),
      tokenPrice = await getTokenPrice(token, CHAIN_TYPES.MATIC)
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
