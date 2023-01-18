const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const trancheCDOContract = require('../../../lib/web3/contracts/idle-cdo/contract.json')
const { getApr, AATranche } = require('../../../lib/web3/contracts/idle-cdo/methods')

const getTradingApy = async trancheCDO => {
  const trancheCDOInstance = new web3.eth.Contract(trancheCDOContract.abi, trancheCDO)
  const tranche = await AATranche(trancheCDOInstance)
  let apr = new BigNumber(await getApr(tranche, trancheCDOInstance))
  apr = apr.dividedBy(new BigNumber(1e18)).dividedBy(100)
  const apy = apr.dividedBy(12).plus(1).exponentiatedBy(12).minus(1)

  return apy.multipliedBy(100).toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
