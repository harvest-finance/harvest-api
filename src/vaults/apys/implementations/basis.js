const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const { UI_DATA_FILES } = require('../../../lib/constants')
const { getUIData } = require('../../../lib/data')
const { basisPool: basisPoolContractInfo } = require('../../../lib/web3/contracts')
const { getIncentivePoolStats } = require('../../../pools')

const getApy = async (rewardPoolAddress, rewardTokenSymbol, lpTokenSymbol, factor, basisPoolId) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const pool = {
    contractAddress: rewardPoolAddress,
    rewardToken: tokens[rewardTokenSymbol].tokenAddress,
  }

  const poolInstance = new web3.eth.Contract(
    basisPoolContractInfo.contract.abi,
    pool.contractAddress,
  )

  const poolContractData = {
    ...basisPoolContractInfo,
    instance: poolInstance,
  }

  const lpTokenData = {
    address: tokens[lpTokenSymbol].tokenAddress,
    decimals: tokens[lpTokenSymbol].decimals,
  }

  const basicApr = await getIncentivePoolStats(
    pool,
    poolContractData,
    lpTokenData,
    undefined,
    basisPoolId,
    pool.rewardToken,
  )

  return new BigNumber(basicApr.apr).multipliedBy(factor).toString()
}

module.exports = {
  getApy,
}
