const { web3BSC } = require('../../../lib/web3')
const BigNumber = require('bignumber.js')
const tokenAddresses = require('../../../lib/data/addresses.json')
const { token: tokenContractData } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices')

const getApy = async (venusRewardPool, venusPerDay, profitSharingFactor) => {
  const {
    methods: { getBalance },
    contract: { abi },
  } = tokenContractData

  const venusTokenPrice = await getTokenPrice('venus')
  const totalVenusPerYearUSD = new BigNumber(venusTokenPrice).times(venusPerDay).times(365)

  const vaiTokenPrice = await getTokenPrice('vai')
  const vaiTokenInstance = new web3BSC.eth.Contract(abi, tokenAddresses.BSC.VAI)
  const totalVaiStaked = await getBalance(venusRewardPool, vaiTokenInstance)
  const totalVaiStakedUSD = new BigNumber(totalVaiStaked)
    .dividedBy(new BigNumber(10).pow(18))
    .times(vaiTokenPrice)

  const vaiAPY = new BigNumber(totalVenusPerYearUSD)
    .dividedBy(totalVaiStakedUSD)
    .times(100)
    .times(profitSharingFactor)
    .toFixed()

  return vaiAPY
}

module.exports = {
  getApy,
}
