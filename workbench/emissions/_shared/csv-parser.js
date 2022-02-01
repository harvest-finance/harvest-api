const assert = require('assert')
const fs = require('fs')
const csvParse = require('csv-parse')
const BigNumber = require('bignumber.js')

function convertFromForEthereumMainnet(filePath, vaultsObject, statefulEmissionsHelperAddress) {
  function isRegularPool(poolAddress) {
    return (
      [
        'WETH',
        'crvSTETH',
        'USDC',
        'USDT',
        'DAI',
        'TUSD',
        'YCRV',
        'ThreePool',
        'crvUSDN',
        'crvBUSD',
        'crvCOMPOUND',
        'crvHUSD',
        'crvEURS',
        'crvUST',
        'WBTC',
        'crvRenWBTC',
        'TBTCMixed',
        'crvHBTC',
        'crvOBTC',
        'oneInch_ETH_DAI',
        'oneInch_ETH_USDC',
        'oneInch_ETH_USDT',
        'oneInch_ETH_WBTC',
        'oneInch_ETH_1INCH',
        'sushi_DAI_WETH',
        'sushi_WBTC_WETH',
        'sushi_USDT_WETH',
        'sushi_USDC_WETH',
        'sushi_SUSHI_WETH',
        'uni_WETH_DPI',
        'UNI_MIC_USDT',
        'UNI_MIS_USDT',
        'UNI_BAC_DAI',
        'UNI_DAI_BAS',
        'basisGold_DAI_BSG',
        'basisGold_DAI_BSGS',
        'mirrorGOOG',
        'mirrorAAPL',
        'mirrorTSLA',
        'mirrorAMZN',
        'basisGold_DSD',
        'basisGold_ESD',
        'basisGold_BAC',
        'crvAAVE',
        'crvGUSD',
      ].find(key => {
        try {
          vaultsObject[key].NewPool
        } catch (e) {
          console.error(key)
        }
        return vaultsObject[key].NewPool === poolAddress
      }) !== undefined
    )
  }

  function isVestingOn(poolAddress) {
    return poolAddress !== 'nothing' && false // making linter happy
  }

  const addresses = {
    GRAIN_FARM_LP_REWARD_POOL: '0xe58f0d2956628921cdEd2eA6B195Fc821c3a2b16',
    FARM_WETH_LP_TOKEN_REWARD_POOL: '0x6555c79a8829b793F332f1535B0eFB1fE4C11958',
    StrategicReserve: '0xd00FCE4966821Da1EdD1221a02aF0AFc876365e4',
    ProfitSharing: '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C',
    Multisig: '0xF49440C1F012d041802b25A73e5B0B9166a75c02',
    FARMSteadUSDCPool: '0x95D2e18C069175523F56B617F96be7575E381547',
  }

  // do not touch this, it needs to match the smart contract enums
  let NotificationType = {
    VOID: 0,
    IFARM: 1,
    FARM: 2,
    TRANSFER: 3,
    PROFIT_SHARE: 4,
    TOKEN: 5,
  }

  return new Promise(resolve => {
    let items = []
    const parse = csvParse.parse
    const parser = parse({
      delimiter: ';',
      from: 2, // ignore header
    })
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let record
      while ((record = parser.read()) !== null) {
        const id = record[0]
        let notificationType
        let address
        let isVested = false
        if (id === '__ProfitSharing') {
          notificationType = NotificationType.PROFIT_SHARE
          address = addresses.ProfitSharing
        } else if (id === '__grainBuybackBot') {
          notificationType = NotificationType.TRANSFER
          address = addresses.Multisig
        } else if (id === '__otherChainsCombined') {
          notificationType = NotificationType.TRANSFER
          address = statefulEmissionsHelperAddress
        } else if (id === 'FARMsteadUSDC24') {
          notificationType = NotificationType.IFARM
          address = addresses.FARMSteadUSDCPool
        } else if (id === '__FarmWeth') {
          notificationType = NotificationType.FARM
          address = addresses.FARM_WETH_LP_TOKEN_REWARD_POOL
        } else if (id === '__StrategicReserve') {
          notificationType = NotificationType.TRANSFER
          address = addresses.StrategicReserve
        } else {
          assert(vaultsObject[id], 'Unknown id ' + id)
          address = vaultsObject[id].NewPool
          if (isRegularPool(address)) {
            notificationType = NotificationType.FARM
          } else {
            notificationType = NotificationType.IFARM
          }
          isVested = isVestingOn(address)
        }
        const values = record[1].split('%')
        assert(values.length == 2, 'Does not use %')
        assert(values[1] == '', 'Does not end with %')
        const item = {
          id,
          notificationType,
          sourcePercentage: `${record[1]}`,
          address,
          isVested,
          percentage: new BigNumber(values[0] * 100).toFixed(0),
        }
        assert(item.address, 'No pool defined for ' + id)
        items.push(item)
      }
    })
    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message)
    })
    parser.on('end', function () {
      console.log(JSON.stringify(items, null, 2))
      resolve(items)
    })
    parser.write(fs.readFileSync(filePath))
    parser.end()
  })
}

function convertFrom(filePath, vaultsObject) {
  return new Promise(resolve => {
    let items = []
    const parse = csvParse.parse
    const parser = parse({
      delimiter: ';',
      from: 2, // ignore header
    })
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let record
      while ((record = parser.read()) !== null) {
        const id = record[0]
        const values = record[1].split('%')
        assert(values.length == 2, 'Does not use %')
        assert(values[1] == '', 'Does not end with %: ' + record[1])
        assert(vaultsObject[id], 'Unknown id ' + id)
        const item = {
          id,
          sourcePercentage: `${record[1]}`,
          address: vaultsObject[id].NewPool,
          percentage: new BigNumber(values[0] * 100).toFixed(0),
        }
        assert(item.address, 'No pool defined for ' + id)
        items.push(item)
      }
    })
    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message)
    })
    parser.on('end', function () {
      console.log(JSON.stringify(items, null, 2))
      resolve(items)
    })
    parser.write(fs.readFileSync(filePath))
    parser.end()
  })
}

module.exports = {
  convertFrom,
  convertFromForEthereumMainnet,
}
