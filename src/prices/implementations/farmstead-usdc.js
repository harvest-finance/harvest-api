const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../lib/web3')
const addresses = require('../../lib/data/addresses.json')
const { farmsteadUSDC } = require('../../lib/web3/contracts')
const { CHAIN_TYPES } = require('../../lib/constants')
const { getTokenPrice } = require('..')

const getPrice = async () => {
  const {
    methods: { getExchangeRateStored },
    contract: {
      abi,
      address: { mainnet },
    },
  } = farmsteadUSDC

  const web3Instance = getWeb3(CHAIN_TYPES.ETH)
  const farmsteadUSDCInstance = new web3Instance.eth.Contract(abi, mainnet)

  const usdcPrice = await getTokenPrice(addresses.USDC)
  const mantissa = 16 // 18 + 6(USDC Decimals) - 8(fUSDC-24 decimals)

  const exchangeRate = new BigNumber(await getExchangeRateStored(farmsteadUSDCInstance)).dividedBy(
    new BigNumber(10).pow(mantissa),
  )

  return new BigNumber(usdcPrice).times(new BigNumber(exchangeRate)).toFixed()
}

module.exports = {
  getPrice,
}
