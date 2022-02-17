const BigNumber = require('bignumber.js')
const { token, crvYPool, pool } = require('../../../lib/web3/contracts')
const { getTokenPriceByAddress } = require('../../../prices/coingecko.js')
const { web3 } = require('../../../lib/web3')
const addresses = require('../../../lib/data/addresses.json')
const pools = require('./convex-pools.json')

let crvAddress = '0xD533a949740bb3306d119CC777fa900bA034cd52',
  cvxAddress = '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  cliffSize = 100000, // * 1e18; //new cliff every 100,000 tokens
  cliffCount = 1000, // 1,000 cliffs
  maxSupply = 100000000 // * 1e18; //100 mil max supply

//// ----------- APRs ----------- ///

const convexAPR = poolName => convexAPRWithPrice(poolName, -1, -1)

const convexAPRWithPrice = async (poolName, crvPrice, cvxPrice) => {
  const pool = pools.find(pool => pool.name == poolName)
  const curveSwap = pool.swap
  const stakeContract = pool.crvRewards

  let apr, supply, virtualPrice

  //get reward rate
  const rate = await rewardRate(stakeContract)

  //get virtual price
  virtualPrice = 1
  if (pool.isV2 == undefined || pool.isV2 == false) {
    virtualPrice = await curveLpValue(1, curveSwap)
  } else {
    virtualPrice = await curveV2LpValue(pool, pool.currency)
  }

  //get supply
  supply = await supplyOf(stakeContract)

  //virtual supply
  supply = supply * virtualPrice

  //crv per underlying per second
  const crvPerUnderlying = rate / supply

  //crv per year
  const crvPerYear = crvPerUnderlying * 86400 * 365
  const cvxPerYear = await getCVXMintAmount(crvPerYear)
  if (cvxPrice <= 0) cvxPrice = await getPrice(cvxAddress, pool.currency)

  if (crvPrice <= 0) crvPrice = await getPrice(crvAddress, pool.currency)

  apr = crvPerYear * crvPrice
  apr += cvxPerYear * cvxPrice

  if (pool.extras != undefined && pool.extras.length > 0) {
    for (const i in pool.extras) {
      const ex = pool.extras[i]
      const exrate = await rewardRate(ex.contract)
      const perUnderlying = exrate / supply
      const perYear = perUnderlying * 86400 * 365
      if (ex.token.toLowerCase() === addresses.rKP3R.toLowerCase()) {
        ex.token = addresses.KP3R
      }
      let price = await getPrice(ex.token, pool.currency)
      if (ex.token.toLowerCase() === addresses.KP3R.toLowerCase()) {
        price = price / 10
      }
      apr += perYear * price
    }
  }

  return apr * 100
}

////--------------- Util  -------------------///

const getCVXMintAmount = async crvEarned => {
  //first get total supply
  const cvxSupply = await supplyOf(cvxAddress)
  //get current cliff
  const currentCliff = cvxSupply / cliffSize
  //if current cliff is under the max
  if (currentCliff < cliffCount) {
    //get remaining cliffs
    const remaining = cliffCount - currentCliff

    //multiply ratio of remaining cliffs to total cliffs against amount CRV received
    let cvxEarned = (crvEarned * remaining) / cliffCount

    //double check we have not gone over the max supply
    const amountTillMax = maxSupply - cvxSupply
    if (cvxEarned > amountTillMax) {
      cvxEarned = amountTillMax
    }
    return cvxEarned
  }
  return 0
}

const balanceOf = async (address, contract, decimals) => {
  const tokenInstance = new web3.eth.Contract(token.contract.abi, contract)

  const fetchedBalance = await token.methods.getBalance(address, tokenInstance)
  const balance = new BigNumber(fetchedBalance)
    .dividedBy(new BigNumber(10).pow(decimals))
    .toNumber()

  return balance
}

const supplyOf = async contract => {
  const tokenInstance = new web3.eth.Contract(token.contract.abi, contract)

  const fetchedTotalSupply = await token.methods.getTotalSupply(tokenInstance)
  const totalSupply = new BigNumber(fetchedTotalSupply)
    .dividedBy(new BigNumber(10).pow(18))
    .toNumber()

  return totalSupply
}

const curveLpValue = async (amount, swapAddress) => {
  const crvYPoolInstance = new web3.eth.Contract(crvYPool.contract.abi, swapAddress)

  const virtualPrice = await crvYPool.methods.getVirtualPrice(crvYPoolInstance)
  const pricePerShare = new BigNumber(virtualPrice).dividedBy(new BigNumber(10).pow(18))

  return new BigNumber(amount).times(pricePerShare).toNumber()
}

const curveV2LpValue = async (pool, currencyType) => {
  //get amount of tokens
  const supply = await supplyOf(pool.lptoken)

  let total = 0
  for (let i = 0; i < pool.coins.length; i++) {
    let bal
    if (pool.coins[i] == '0x0000000000000000000000000000000000000000') {
      bal = new BigNumber(await web3.eth.getBalance(pool.swap)).div(1e18)
      pool.coins[i] = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    } else {
      bal = await balanceOf(pool.swap, pool.coins[i], pool.coinDecimals[i])
    }

    const price = await getPrice(pool.coins[i], currencyType)

    total += bal * price
  }

  const value = total / supply
  return value
}

const rewardRate = async contract => {
  const poolInstance = new web3.eth.Contract(pool.contract.abi, contract)

  const fetchedRewardRate = await pool.methods.rewardRate(poolInstance)

  return new BigNumber(fetchedRewardRate).dividedBy(new BigNumber(10).pow(18)).toNumber()
}

const getPrice = async (contract_address, currency = 'usd') => {
  const price = await getTokenPriceByAddress(
    contract_address.toLowerCase(),
    undefined, // network
    currency.toLowerCase(), // currency
  )
  return Number(price)
}

module.exports = { convexAPR }
