const BigNumber = require('bignumber.js')
const { getWeb3 } = require('../../../lib/web3')

const { getUIData } = require('../../../lib/data')
const { getIncentivePoolStats } = require('../../../pools')
const { UI_DATA_FILES } = require('../../../lib/constants')

const { pool: poolContractInfo } = require('../../../lib/web3/contracts')

const getApy = async (snxPoolAddress, rewardTokenSymbol, lpTokenSymbol, factor) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const pool = {
    contractAddress: snxPoolAddress,
    rewardToken: tokens[rewardTokenSymbol].tokenAddress,
  }

  const web3Instance = getWeb3(tokens[lpTokenSymbol].chain)

  const poolInstance = new web3Instance.eth.Contract(
    poolContractInfo.contract.abi,
    pool.contractAddress,
  )

  const poolContractData = {
    ...poolContractInfo,
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
    undefined,
    pool.rewardToken,
  )

  return new BigNumber(basicApr.apr).multipliedBy(factor).toString()
}

module.exports = {
  getApy,
}
