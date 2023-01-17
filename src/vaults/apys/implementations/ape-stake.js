const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')

const { getPool, getRewardsBy } = require('../../../lib/web3/contracts/ape-stake/methods')
const apeCoinStakingContract = require('../../../lib/web3/contracts/ape-stake/contract.json')

const ONE_YEAR = new BigNumber(3600 * 24 * 365)
const APE_POOL_ID = 0

const getApy = async reduction => {
  const apeCoinStakingInstance = new web3.eth.Contract(
    apeCoinStakingContract.abi,
    apeCoinStakingContract.address.mainnet,
  )

  const apePool = await getPool(APE_POOL_ID, apeCoinStakingInstance)
  const currentTimeStamp = Math.floor(Date.now() / 1000)
  const rewardInfo = await getRewardsBy(
    APE_POOL_ID,
    currentTimeStamp,
    currentTimeStamp + 1,
    apeCoinStakingInstance,
  )
  const rewardPerSec = new BigNumber(rewardInfo[0])
  const totalStaked = new BigNumber(apePool.stakedAmount)

  let apy = rewardPerSec.multipliedBy(ONE_YEAR).dividedBy(totalStaked)
  if (reduction) {
    apy = apy.multipliedBy(reduction)
  }

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getApy,
}
