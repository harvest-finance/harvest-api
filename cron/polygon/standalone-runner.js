const hre = require('hardhat')
const fs = require('fs')
const axios = require('axios')

const IERC20Abi = require('./abi/IERC20Upgradeable.json')
const IControllerV1Abi = require('./abi/Controller.json')
const vaultAbi = require('./abi/Vault.json')
const strategyAbi = require('./abi/Strategy.json')
const { web3 } = require('hardhat')
const settings = require('./settings.json')

// logic control
const nextVault = require('./next-vault.json')
const vaultDecision = require('./vault-decision.json')

const ethers = hre.ethers

// Prometheus monitoring
const promClient = require('prom-client')
const Registry = promClient.Registry
const register = new Registry()

async function pushMetrics(labels) {
  if (!settings.prometheusMonitoring || settings.prometheusMonitoring.enabled !== true) {
    return
  }
  const gateway = new promClient.Pushgateway(
    settings.prometheusMonitoring.pushGatewayUrl,
    [],
    register,
  )
  return await gateway
    .push(labels)
    .then(({ resp, body }) => {
      console.log(`Metrics pushed, status ${resp.statusCode} ${body}`)
      register.clear()
    })
    .catch(err => {
      console.log(`Error pushing metrics: ${err}`)
    })
}

async function reportSimulationProfit(
  vault,
  block,
  ethProfit,
  execute,
  maxFeePerGas,
  maxPriorityFeePerGas,
) {
  if (!settings.prometheusMonitoring || settings.prometheusMonitoring.enabled !== true) {
    return
  }
  const profitMetric = new promClient.Gauge({
    name: 'eth_profit',
    help: 'profit shared Ether',
    registers: [register],
  })
  register.registerMetric(profitMetric)
  profitMetric.set(ethProfit)

  const blockMetric = new promClient.Gauge({
    name: 'eth_block',
    help: 'block number',
    registers: [register],
  })
  register.registerMetric(blockMetric)
  blockMetric.set(block)

  const executeMetric = new promClient.Gauge({
    name: 'eth_execute_flag',
    help: 'execute flag',
    registers: [register],
  })
  register.registerMetric(executeMetric)
  executeMetric.set(execute == true ? 1 : 0)

  const gasFeeMetric = new promClient.Gauge({
    name: 'eth_gas_fee',
    help: 'transaction gas fee - maxFeePerGas',
    registers: [register],
  })
  register.registerMetric(gasFeeMetric)
  gasFeeMetric.set(maxFeePerGas)

  const gasPriorityFeeMetric = new promClient.Gauge({
    name: 'eth_gas_priority_fee',
    help: 'transaction gas priority fee - maxPriorityFeePerGas',
    registers: [register],
  })
  register.registerMetric(gasPriorityFeeMetric)
  gasPriorityFeeMetric.set(maxPriorityFeePerGas)

  let labels = {
    jobName: vault,
    groupings: { instance: 'polygon' },
  }
  return pushMetrics(labels)
}

async function reportError(vault, block, error) {
  if (!settings.prometheusMonitoring || settings.prometheusMonitoring.enabled !== true) {
    return
  }
  const errorMetric = new promClient.Counter({
    name: block == 0 ? 'mainnet_error' : 'simulation_error',
    help: 'error during hardwork execution',
    registers: [register],
  })
  register.registerMetric(errorMetric)
  errorMetric.inc(1)

  let labels = {
    jobName: vault,
    groupings: { instance: 'polygon', block: block, error: error },
  }
  return pushMetrics(labels)
}

// Only execute the `doHardWork` when
// the profit share is `greatDealRatio` times better than the gas cost in Ether
const greatDealRatio = 6
// or when the funds available for invest is 1/(idleFraction) of the total funds.
// note that funds that are available for invest are different from funds sitting in vault
const idleFraction = 20
// or minimum of token sent to msig.
const minMsigProfit = 0.001e18
const bedBot = '0xbed04c43e74150794f2ff5b62b4f73820edaf661'

const addresses = require('../../../harvest-api/data/mainnet/addresses.json').MATIC
const allVaults = Object.keys(addresses.V2)

const disableCron = vaultAddress =>
  Object.keys(addresses.V2).find(
    key =>
      addresses.V2[key].NewVault &&
      addresses.V2[key].NewVault.toLowerCase() === vaultAddress.toLowerCase() &&
      addresses.V2[key].doHardwork === false,
  )

const useMsigProfitCalculation = vaultAddress =>
  Object.keys(addresses.V2).find(
    key =>
      addresses.V2[key].NewVault &&
      addresses.V2[key].NewVault.toLowerCase() === vaultAddress.toLowerCase() &&
      addresses.V2[key].useMsigProfitCalculation === true,
  )

const vaultIds = allVaults
  .filter(vaultId => addresses.V2[vaultId].NewVault)
  .filter(vault => !disableCron(addresses.V2[vault].NewVault))

// input vault key and output next vault key in the list
function findNextVaultKey(curVault) {
  let id = vaultIds.findIndex(element => element == curVault)
  let nextId

  if (id == vaultIds.length - 1) {
    nextId = 0
  } else {
    nextId = id + 1
  }
  return vaultIds[nextId]
}

async function roughQuoteXInMATIC(xAmount, xAddress, xMATICLPPair) {
  var x = new web3.eth.Contract(IERC20Abi, xAddress)
  var matic = new web3.eth.Contract(IERC20Abi, addresses.WMATIC)

  let xInPair = await x.methods.balanceOf(xMATICLPPair).call()
  let maticInPair = await matic.methods.balanceOf(xMATICLPPair).call()

  // Use a very rough calculation. This would be erroneous when the farmAmount is large.
  // However this should be fine for our purposes.
  let maticOut = (maticInPair / xInPair) * xAmount

  return maticOut
}

// determines the gas price by taking the minimum of "locally set max gas" and the gas price returned from api
async function getFeeData() {
  const gasPriceMin = 65e9 // 65 gwei minimum in Polygon

  let fee = await axios
    .get('https://owlracle.info/poly/gas?accept=90&apikey=' + settings.owlracleApiKey)
    .then(response => {
      return Math.round(parseFloat(response.data.speeds[0].gasPrice) * 1e9)
    })
    .catch(error => {
      console.log(error)
      return 0
    })

  if (fee < gasPriceMin) {
    fee = gasPriceMin
  } else if (fee > settings.gasPriceMax) {
    fee = settings.gasPriceMax
  }

  let priorityFee = Math.round(fee / 2)
  if (priorityFee > settings.priorityFeeMax) {
    priorityFee = settings.priorityFeeMax
  }
  return { maxFeePerGas: fee, maxPriorityFeePerGas: priorityFee }
}

// properly setup the txSenderInfo for sending
async function formulateTxSenderInfo(sender) {
  let submitGasPrice = await getFeeData()
  let nonce = await web3.eth.getTransactionCount(sender)

  console.log(
    'maxFeePerGas:',
    submitGasPrice.maxFeePerGas / 1e9,
    'maxPriorityFeePerGas:',
    submitGasPrice.maxPriorityFeePerGas / 1e9,
  )

  const txSenderInfo = {
    type: 2,
    maxFeePerGas: submitGasPrice.maxFeePerGas,
    maxPriorityFeePerGas: submitGasPrice.maxPriorityFeePerGas,
    gasLimit: settings.gasLimit,
    nonce,
    from: sender,
  }
  return txSenderInfo
}

// helper functions
// wait for ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// return a random number between min and max
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

let curVaultKey = nextVault.next_vault_key
var controller = new web3.eth.Contract(IControllerV1Abi, addresses.Controller)
var profitShareAddr = addresses.ProfitShareTarget
let vaultAddress = addresses.V2[curVaultKey].NewVault
let vault = new web3.eth.Contract(vaultAbi, vaultAddress)
let eth = new web3.eth.Contract(IERC20Abi, addresses.pWETH)
let msigRewardToken

let msigProfit = 0

async function main() {
  await hre.run('compile')
  const accounts = await ethers.getSigners()
  console.log('==================================================================')

  if (process.env.HARDHAT_NETWORK == 'hardhat') {
    let txSenderInfo = await formulateTxSenderInfo(bedBot)
    console.log('Executor: ', bedBot)
    console.log('SIMULATION')
    console.log('Doing simulation on vault ', curVaultKey)
    console.log('Vault Address: ', vaultAddress)

    let currentSimBlock = await web3.eth.getBlockNumber()
    console.log('Fresh simulation: ', currentSimBlock)

    // Simulate with
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [bedBot],
    })

    let decision
    let executeFlag = false
    let availableToInvestOut = await vault.methods.availableToInvestOut().call()
    let underlyingBalanceWithInvestment = await vault.methods
      .underlyingBalanceWithInvestment()
      .call()

    console.log('[ Do we need to push funds? ]')
    console.log(
      'vault investment ratio: ',
      await vault.methods.vaultFractionToInvestNumerator().call(),
      '/',
      await vault.methods.vaultFractionToInvestDenominator().call(),
    )

    var underlying = new web3.eth.Contract(IERC20Abi, await vault.methods.underlying().call())
    let underlyingInVault = await underlying.methods.balanceOf(vaultAddress).call()
    console.log('underlying in vault:     ', underlyingInVault)
    console.log('AUM:                     ', underlyingBalanceWithInvestment)
    console.log('available to invest out: ', availableToInvestOut)

    if (availableToInvestOut > underlyingBalanceWithInvestment / idleFraction) {
      console.log('====> need to PUSH funds ====>')
      executeFlag = true
    } else {
      console.log(".... funds don't need to be pushed")
    }
    let ethInProfitShareBefore = await eth.methods.balanceOf(profitShareAddr).call()
    let ethProfit = 0
    let profitInMsigBefore = 0
    if (useMsigProfitCalculation(vaultAddress)) {
      console.log('[ Using msig profit calculation.. ]')
      let strategyAddress = addresses.V2[curVaultKey].NewStrategy
      let strategy = new web3.eth.Contract(strategyAbi, strategyAddress)
      let rewardTokenAddress = await strategy.methods.rewardToken().call()
      console.log('reward token:', rewardTokenAddress)
      msigRewardToken = new web3.eth.Contract(IERC20Abi, rewardTokenAddress)
      profitInMsigBefore = await msigRewardToken.methods.balanceOf(addresses.msig).call()
    }
    if (executeFlag == false) {
      console.log('======= Doing hardwork ======')
      try {
        console.time('doHardwork simulation')
        let tx = await controller.methods.doHardWork(vaultAddress).send(txSenderInfo)
        console.timeEnd('doHardwork simulation')

        let maticCost = tx.gasUsed * txSenderInfo.maxFeePerGas
        let ethInProfitShareAfter = await eth.methods.balanceOf(profitShareAddr).call()
        ethProfit = ethInProfitShareAfter - ethInProfitShareBefore
        let roughProfitInMatic = await roughQuoteXInMATIC(
          ethProfit,
          addresses.pWETH,
          addresses.V2.quickswap_ETH_MATIC.Underlying,
        )

        console.log('gasUsed:            ', tx.gasUsed)
        console.log('profit in Matic:    ', roughProfitInMatic / 1e18)
        console.log('Matic cost:         ', maticCost / 1e18)

        console.log('[ Is the profit share good enough? ]')
        console.log('before:             ', ethInProfitShareBefore)
        console.log('after:              ', ethInProfitShareAfter)
        console.log('profit shared Ether: ', ethProfit / 1e18)

        if (useMsigProfitCalculation(vaultAddress)) {
          let profitInMsigAfter = await msigRewardToken.methods.balanceOf(addresses.msig).call()
          msigProfit = profitInMsigAfter - profitInMsigBefore
          console.log('msig profit shared: ', msigProfit / 1e18)
        }

        if (roughProfitInMatic > maticCost * greatDealRatio || msigProfit > minMsigProfit) {
          console.log('====> Time to doHardwork! ====')
          executeFlag = true
        } else {
          console.log('............................. bad deal')
        }
      } catch (e) {
        console.log('Error during simulation: ')
        console.log(e)
        await reportError(curVaultKey, currentSimBlock, e)
      }
    }
    if (disableCron(vaultAddress)) {
      console.log('..........[FORCED SKIP]')
      executeFlag = false
    }

    decision = {
      vaultKey: curVaultKey,
      execute: executeFlag,
    }

    fs.writeFileSync('./vault-decision.json', JSON.stringify(decision), 'utf-8')
    console.log('Decision wrote in file.')
    await reportSimulationProfit(
      curVaultKey,
      currentSimBlock,
      ethProfit,
      executeFlag,
      txSenderInfo.maxFeePerGas / 1e9,
      txSenderInfo.maxPriorityFeePerGas / 1e9,
    )
  } else if (process.env.HARDHAT_NETWORK == 'cron_mainnet') {
    let hardworker = accounts[0].address
    let txSenderInfo = await formulateTxSenderInfo(hardworker)
    console.log('Executor: ', hardworker)
    console.log('cron_mainnet')

    // vaultDecision is read when the script is first started.
    if (vaultDecision.vaultKey != curVaultKey) {
      console.log("ERROR: decision file info doesn't match vault key, exiting...")
      return
    }

    if (vaultDecision.execute) {
      console.log('Mainnet: Sending the tx of ', vaultDecision.vaultKey)
      try {
        await controller.methods.doHardWork(vaultAddress).send(txSenderInfo)
      } catch (e) {
        console.log('Error when sending tx: ')
        console.log(e)
        await reportError(curVaultKey, 0, e)
      }
    } else {
      console.log('Mainnet: NOT sending the tx of ', vaultDecision.vaultKey)
    }

    let nextVaultKey = findNextVaultKey(curVaultKey)
    let isLastVault = curVaultKey == vaultIds[vaultIds.length - 1]
    let newNextVault = {
      next_vault_key: nextVaultKey,
    }
    fs.writeFileSync('./next-vault.json', JSON.stringify(newNextVault), 'utf-8')
    console.log('NEXT Vault:', nextVaultKey)

    if (isLastVault) {
      // Simulate and execute again in 5 hrs
      console.log('Waiting for 5 hrs for the next round')
      await sleep(5 * 60 * 60 * 1000)
    } else {
      let waitFor = getRandomInt(1000 * 60, 1000 * 60 * 2)
      console.log('Waiting for: ', waitFor)
      await sleep(waitFor)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
