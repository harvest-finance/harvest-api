const BigNumber = require('bignumber.js')
const { web3Socket } = require('../../../lib/web3')
const liquityStakingContract = require('../../../lib/web3/contracts/liquity-staking/contract.json')
const { getTokenPrice } = require('../../../prices')

const getApy = async (timeLookback, reduction) => {
  let blockTime = 14,
    currentBlock = await web3Socket.eth.getBlockNumber(),
    fromBlock = currentBlock - Math.floor(timeLookback / blockTime)

  const { abi: liquityStakingAbi, address: liquityStakingAddress } = liquityStakingContract

  const liquityStakingInstance = new web3Socket.eth.Contract(
    liquityStakingAbi,
    liquityStakingAddress.mainnet,
  )
  const lusdUpdateEvents = (
    await liquityStakingInstance.getPastEvents('F_LUSDUpdated', {
      fromBlock,
      currentBlock,
    })
  ).map(event => ({
    tx: event.transactionHash,
    returnValues: event.returnValues,
  }))

  const ethUpdateEvents = (
    await liquityStakingInstance.getPastEvents('F_ETHUpdated', {
      fromBlock,
      currentBlock,
    })
  ).map(event => ({
    tx: event.transactionHash,
    returnValues: event.returnValues,
  }))

  const lusdDataSize = lusdUpdateEvents.length
  let lusdPerSharePerYear = new BigNumber(0)
  if (lusdDataSize > 1) {
    let startTx = await web3Socket.eth.getTransaction(lusdUpdateEvents[0].tx),
      finishTx = await web3Socket.eth.getTransaction(lusdUpdateEvents[lusdDataSize - 1].tx),
      startBlock = await web3Socket.eth.getBlock(startTx.blockNumber),
      finishBlock = await web3Socket.eth.getBlock(finishTx.blockNumber),
      startTime = new BigNumber(startBlock.timestamp),
      finishTime = new BigNumber(finishBlock.timestamp),
      startValue = new BigNumber(lusdUpdateEvents[0].returnValues._F_LUSD).div(
        new BigNumber(10).pow(18),
      ),
      finishValue = new BigNumber(lusdUpdateEvents[lusdDataSize - 1].returnValues._F_LUSD).div(
        new BigNumber(10).pow(18),
      )
    lusdPerSharePerYear = finishValue
      .minus(startValue)
      .div(finishTime.minus(startTime))
      .times(24 * 3600 * 365)
  }

  const ethDataSize = ethUpdateEvents.length
  let ethPerSharePerYear = new BigNumber(0)
  if (ethDataSize > 1) {
    let startTx = await web3Socket.eth.getTransaction(ethUpdateEvents[0].tx),
      finishTx = await web3Socket.eth.getTransaction(ethUpdateEvents[ethDataSize - 1].tx),
      startBlock = await web3Socket.eth.getBlock(startTx.blockNumber),
      finishBlock = await web3Socket.eth.getBlock(finishTx.blockNumber),
      startTime = new BigNumber(startBlock.timestamp),
      finishTime = new BigNumber(finishBlock.timestamp),
      startValue = new BigNumber(ethUpdateEvents[0].returnValues._F_ETH).div(
        new BigNumber(10).pow(18),
      ),
      finishValue = new BigNumber(ethUpdateEvents[ethDataSize - 1].returnValues._F_ETH).div(
        new BigNumber(10).pow(18),
      )
    ethPerSharePerYear = finishValue
      .minus(startValue)
      .div(finishTime.minus(startTime))
      .times(24 * 3600 * 365)
  }

  let lusdPrice = await getTokenPrice('0x5f98805A4E8be255a32880FDeC7F6728C6568bA0'),
    ethPrice = await getTokenPrice('WETH'),
    lqtyPrice = await getTokenPrice('LQTY'),
    apr = lusdPerSharePerYear
      .times(lusdPrice)
      .plus(ethPerSharePerYear.times(ethPrice))
      .div(lqtyPrice)

  if (reduction) {
    apr = apr.times(reduction)
  }

  return apr.times(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
