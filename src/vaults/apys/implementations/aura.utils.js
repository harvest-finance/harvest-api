const pools = require('./aura-pools.json')

const BigNumber = require('bignumber.js')

const { web3 } = require('../../../lib/web3')
const { token, pool } = require('../../../lib/web3/contracts')
const { getTokenPrice } = require('../../../prices/index')
//const getBalancerTokenPrice = require('../../../prices/implementations/balancer.js').getPrice

//** Constants */
const BAL_ADDRESS = '0xba100000625a3754423978a60c9317c58a424e3D'
const AURA_ADDRESS = '0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF'

//// ----------- APRs ----------- ////

/** APRs */

/**
 * Calculate APR of each pools
 * @param {string} poolName
 * @param {string} networkId
 * @returns {number}
 */
const auraAPR = (poolName, networkId) => auraAPRWithPrice(poolName, networkId, -1, -1)

/**
 * Calculate APR with token price
 * @param {string} poolName
 * @param {string} networkId
 * @param {number} balPrice
 * @param {number} auraPrice
 * @returns {number}
 */
const auraAPRWithPrice = async (poolName, networkId, balPrice, auraPrice) => {
  const pool = pools.find(pool => pool.name == poolName)
  const stakeContract = pool.rewardPool

  // Get Reward Rate.
  // The ratio between accumulated reward amount and the elapsed time since the last update.
  // uint256 rewardRate = reward.div(duration)
  const rate = await rewardRate(stakeContract)

  // Get Virtual Price.
  // The current price of the pool LP token relative to the underlying pool assets.
  const virtualPrice = await getTokenPrice(pool.lptoken, pool.currency)

  // Get Supply of Underlying Tokens(BPT).
  // The supply of all underlying tokens from corresponding Aura Pool.
  const supply = await supplyOf(stakeContract)

  // Calculate Pool Total Value Locked.
  // The total value locked of a pool.
  // Total Supply of Pool Underlying Tokens * Price of Underlying Tokens(BPT).
  const tvl = supply * virtualPrice

  // BAL per underlying per second.
  const balPerUnderlying = rate / tvl

  // BAL per year.
  const balPerYear = balPerUnderlying * 86400 * 365
  if (balPrice <= 0) balPrice = await getTokenPrice(BAL_ADDRESS)

  // AURA per year.
  const auraPerYear = await getAuraMintAmount(balPerYear)
  if (auraPrice <= 0) auraPrice = await getTokenPrice(AURA_ADDRESS)

  let apr = balPerYear * balPrice
  apr += auraPerYear * auraPrice

  if (pool.extras != undefined && pool.extras.length > 0) {
    for (const i in pool.extras) {
      const ex = pool.extras[i]
      const exRate = await rewardRate(ex.contract)
      const perUnderlying = exRate / tvl
      const perYear = perUnderlying * 86400 * 365
      let price = await getTokenPrice(ex.token)
      apr += perYear * price
    }
  }

  return apr * 100
}

/** Util */

/**
 * Fetch the reward rate of the Aura reward pool
 * @param {string} contract
 * @returns {number}
 */
const rewardRate = async contract => {
  const poolInstance = new web3.eth.Contract(pool.contract.abi, contract)
  const fetchedRewardRate = await pool.methods.rewardRate(poolInstance)

  return new BigNumber(fetchedRewardRate).dividedBy(new BigNumber(10).pow(18)).toNumber()
}

/**
 * Fetch the total supply of a token
 * @param {string} contract
 * @returns {number}
 */
const supplyOf = async contract => {
  const tokenInstance = new web3.eth.Contract(token.contract.abi, contract)

  const fetchedTotalSupply = await token.methods.getTotalSupply(tokenInstance)
  const totalSupply = new BigNumber(fetchedTotalSupply)
    .dividedBy(new BigNumber(10).pow(18))
    .toNumber()

  return totalSupply
}

/**
 * Calculate the mint amount of Aura
 * @param {number} balEarned
 * @returns {number}
 */
const getAuraMintAmount = async balEarned => {
  const reductionPerCliff = 100000
  const totalCliffs = 500
  const initMintSupply = 50000000
  const emissionMaxSupply = 50000000
  const minterMinted = 0
  const totalSupply = await supplyOf(AURA_ADDRESS)

  // e.g. emissionsMinted = 6e25 - 5e25 - 0 = 1e25
  const emissionsMinted = totalSupply - initMintSupply - minterMinted

  // e.g. reductionPerCliff = 5e25 / 500 = 1e23
  // e.g. cliff = 1e25 / 1e23 = 100
  const cliff = emissionsMinted / reductionPerCliff

  // e.g. 100 < 500
  if (cliff < totalCliffs) {
    // e.g. (new) reduction = (500 - 100) * 2.5 + 700 = 1700
    // e.g. (new) reduction = (500 - 250) * 2.5 + 700 = 1325
    // e.g. (new) reduction = (500 - 400) * 2.5 + 700 = 950
    const reduction = (totalCliffs - cliff) * 2.5 + 700
    // e.g. (new) amount = 1e19 * 1700 / 500 =  34e18
    // e.g. (new) amount = 1e19 * 1325 / 500 =  26.5e18
    // e.g. (new) amount = 1e19 * 950 / 500  =  19e17
    let amount = (balEarned * reduction) / totalCliffs

    // e.g. amtTillMax = 5e25 - 1e25 = 4e25
    const amtTillMax = emissionMaxSupply - emissionsMinted
    if (amount > amtTillMax) {
      amount = amtTillMax
    }

    return amount
  }

  return 0
}

module.exports = { auraAPR }
