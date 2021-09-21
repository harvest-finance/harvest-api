const BigNumber = require('bignumber.js')

const { getTokenPrice } = require('../')
const { get, find } = require('lodash')

const { getWeb3 } = require('../../lib/web3')
const { getUIData } = require('../../lib/data')

const { vault: vaultContractData } = require('../../lib/web3/contracts')

const { UI_DATA_FILES, CHAIN_TYPES } = require('../../lib/constants')

const getPrice = async (tokenAddress, tokenDecimals) => {
  const {
    contract: { abi: vaultAbi },
    methods: { getPricePerFullShare },
  } = vaultContractData

  const tokens = await getUIData(UI_DATA_FILES.TOKENS)

  const chain = get(
    find(tokens, token => token.vaultAddress === tokenAddress),
    'chain',
    CHAIN_TYPES.ETH,
  )

  const web3Instance = getWeb3(chain)
  const fTokenVaultInstance = new web3Instance.eth.Contract(vaultAbi, tokenAddress)

  let tokenSymbol = Object.keys(tokens).find(token => tokens[token].vaultAddress === tokenAddress)
  if (tokenSymbol == 'IFARM') {
    tokenSymbol = 'FARM'
  }

  const underlyingTokenPrice = new BigNumber(await getTokenPrice(tokenSymbol))

  const vaultSharePrice = await getPricePerFullShare(fTokenVaultInstance)

  const fTokenPrice = new BigNumber(vaultSharePrice)
    .multipliedBy(underlyingTokenPrice)
    .dividedBy(new BigNumber(10).exponentiatedBy(tokenDecimals))

  return fTokenPrice.toString(10)
}

module.exports = {
  getPrice,
}
