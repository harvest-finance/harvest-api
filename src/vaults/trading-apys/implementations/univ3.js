const { web3Socket } = require('../../../lib/web3')
const univ3ControllerContract = require('../../../lib/web3/contracts/uniswap-v3-controller/contract.json')

// fromBlock = 12429930: It was the earliest block when Uniswap V3 vaults were deployed
const getTradingApy = async (vaultAddress, fromBlock = 12429930, toBlock = 'latest') => {
  let latestHarvestsToAverageOverForVault,
    latestHarvestsToAverageOver = 3,
    dailyAPRTotal = 0

  const instance = new web3Socket.eth.Contract(
    univ3ControllerContract.abi,
    univ3ControllerContract.address.mainnet,
  )
  const vaultEvents = (
    await instance.getPastEvents('SharePriceChangeLog', {
      filter: {
        vault: vaultAddress,
      },
      fromBlock,
      toBlock,
    })
  ).map(event => ({
    tx: event.transactionHash,
    returnValues: event.returnValues,
  }))

  const dataSize = vaultEvents.length
  if (dataSize > 1) {
    latestHarvestsToAverageOverForVault =
      vaultEvents.length >= latestHarvestsToAverageOver ? latestHarvestsToAverageOver : dataSize

    for (let i = 0; i < latestHarvestsToAverageOverForVault; i++) {
      let timestamp1 = vaultEvents[dataSize - 2 - i].returnValues.timestamp,
        sharePrice1 = vaultEvents[dataSize - 1 - i].returnValues.oldSharePrice,
        timestamp2 = vaultEvents[dataSize - 1 - i].returnValues.timestamp,
        sharePrice2 = vaultEvents[dataSize - 1 - i].returnValues.newSharePrice

      const dailyAPR =
        ((3600 * 24 * (sharePrice2 - sharePrice1)) / sharePrice1 / (timestamp2 - timestamp1)) * 100
      dailyAPRTotal += dailyAPR
    }
  }

  const dailyAPR = dailyAPRTotal / latestHarvestsToAverageOverForVault
  const yearlyApy = (Math.pow(1 + dailyAPR / 100, 365) - 1) * 100

  return Number.isNaN(yearlyApy) ? '0' : yearlyApy.toString()
}

module.exports = {
  getTradingApy,
}
