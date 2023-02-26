const BigNumber = require('bignumber.js')
const { getPoolInfo } = require('../../../lib/third-party/balancer')
const { getAaveV2Market } = require('../../../lib/third-party/aave')
const boostInfo = require('./balancer-boost-info.json')
const { executeTradingApyFunction } = require('../index.js')
const { get7MAAPRs } = require('../../../lib/third-party/lido')
const { getYearlyAPR } = require('../../../lib/third-party/rocket-pool')

const getBoostAPY = async (poolAddress, networkId) => {
  const poolBoostInfo = boostInfo[poolAddress]
  const poolId = poolBoostInfo.poolId
  const tokens = poolBoostInfo.boostedUnderlyings
  const types = poolBoostInfo.boostTypes

  const poolInfo = await getPoolInfo(poolId, networkId)
  const tokenValues = poolInfo.tokenValues
  const tvl = poolInfo.totalLiquidity

  let apy = new BigNumber(0)
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const tokenWeight = tokenValues[token]
      ? tokenValues[token].div(tvl)
      : tokenValues[token.toLowerCase()].div(tvl)

    let partApy
    if (types[i] == 'Aave') {
      partApy = await getAaveApy(poolBoostInfo.aaveTags[i])
    } else if (types[i] == 'balLP') {
      partApy = await getLPApy(token, networkId)
    } else if (types[i] == 'stakedMatic') {
      partApy = await getStakedMaticApy(token)
    } else if (types[i] == 'stakedEth') {
      partApy = (await getStakedEthApy(token, networkId)) / 2
    } else {
      console.error(`Balancer boost type: ${types[i]} not recognized`)
      continue
    }
    apy = apy.plus(tokenWeight.times(partApy))
  }
  return apy.toNumber()
}

const getLPApy = async (token, networkId) => {
  let id
  if (networkId == '1') {
    id = 'balancerv2_eth'
  } else if (networkId == '137') {
    id = 'balancerv2_matic'
  } else {
    console.error(`Network ID: ${networkId} not supported`)
    return 0
  }
  const apy = await executeTradingApyFunction('LP', [token, id])
  return apy
}

const getAaveApy = async tokenId => {
  const aaveData = await getAaveV2Market()
  const aavePool = JSON.parse(JSON.stringify(aaveData.reserves)).filter(
    ({ symbol }) => symbol === tokenId,
  )
  return new BigNumber(aavePool[0].liquidityRate).times(100)
}

const getStakedEthApy = async (token, networkId) => {
  if (token == '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0') {
    return await get7MAAPRs(networkId)
  } else if (token == '0xae78736Cd615f374D3085123A210448E74Fc6393') {
    return await getYearlyAPR(networkId)
  }
}

const getStakedMaticApy = async token => {
  if (token == '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6') {
    return 5.76
  } else {
    return 6.3
  }
}

module.exports = {
  getBoostAPY,
}
