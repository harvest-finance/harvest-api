const BigNumber = require('bignumber.js')
const { web3 } = require('../../../lib/web3')
const trancheCDOContract = require('../../../lib/web3/contracts/idle-cdo/contract.json')
const { getApr, AATranche } = require('../../../lib/web3/contracts/idle-cdo/methods')

const getTradingApy = async trancheCDO => {
  let apy
  const trancheCDOInstance = new web3.eth.Contract(trancheCDOContract.abi, trancheCDO)
  const tranche = await AATranche(trancheCDOInstance)
  apy = new BigNumber(await getApr(tranche, trancheCDOInstance))
  apy = apy.dividedBy(new BigNumber(1e18))

  return apy.toFixed(2, 1)
}

module.exports = {
  getTradingApy,
}
