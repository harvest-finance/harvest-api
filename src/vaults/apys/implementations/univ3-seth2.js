const { web3Socket } = require('../../../lib/web3')
const univ3EventsContract = require('../../../lib/web3/contracts/uniswap-v3-sharepriceEvents/contract.json')

// fromBlock = 12429930: It was the earliest block when Uniswap V3 vaults were deployed
const getApy = async (vaultAddress, fromBlock = 12429930, toBlock = 'latest') => {
  let latestHarvestsToAverageOverForVault,
    latestHarvestsToAverageOver = 2,
    dailyAPRTotal = 0

  const instance = new web3Socket.eth.Contract(univ3EventsContract.abi, vaultAddress)
  const vaultEvents = (
    await instance.getPastEvents('SharePriceChangeTrading', {
      fromBlock,
      toBlock,
    })
  ).map(event => ({
    tx: event.transactionHash,
    returnValues: event.returnValues,
  }))

  const dataSize = vaultEvents.length
  let startTime, endTime
  if (dataSize > 1) {
    latestHarvestsToAverageOverForVault =
      vaultEvents.length >= latestHarvestsToAverageOver ? latestHarvestsToAverageOver : dataSize

    for (let i = 0; i < latestHarvestsToAverageOverForVault; i++) {
      let timestamp1 = vaultEvents[dataSize - 1 - i].returnValues.previousTimestamp,
        sharePrice1 = vaultEvents[dataSize - 1 - i].returnValues.oldPrice,
        timestamp2 = vaultEvents[dataSize - 1 - i].returnValues.newTimestamp,
        sharePrice2 = vaultEvents[dataSize - 1 - i].returnValues.newPrice
      if (i == 0) {
        endTime = timestamp2
      } else if (i == latestHarvestsToAverageOverForVault - 1) {
        startTime = timestamp1
      }
      const dailyAPR = ((3600 * 24 * (sharePrice2 - sharePrice1)) / sharePrice1) * 100
      dailyAPRTotal += dailyAPR
    }
  }

  const dailyAPR = dailyAPRTotal / (endTime - startTime)
  const yearlyApy = (Math.pow(1 + dailyAPR / 100, 365) - 1) * 100

  return Number.isNaN(yearlyApy) ? '0' : yearlyApy.toString()
}

module.exports = {
  getApy,
}
