const axios = require('axios')
const hre = require('hardhat')
const ethers = hre.ethers

const process = require('process')
const { web3 } = require('hardhat')
const secret = require('./dev-keys.json')
const profitShare = require('./modules/profitShare.js')
const sEthClaimer = require('./modules/sEthClaimer.js')
const fs = require('fs')

const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'))
const gasPriceApiEndpoint =
  'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey='

// determines the gas price by taking the minimum of "locally set max gas" and the gas price returned from api
async function getGasPrice() {
  let gasPrice =
    (await axios.get(gasPriceApiEndpoint + secret.etherscanKey)).data.result.FastGasPrice *
    1000000000
  //let gasPrice = 101000000000;
  if (gasPrice > settings.gasPriceMax) {
    gasPrice = settings.gasPriceMax
  }
  return gasPrice
}

// properly setup the txSenderInfo for sending
async function formulateTxSenderInfo(sender) {
  let submitGasPrice = await getGasPrice()
  let nonce = await web3.eth.getTransactionCount(sender)

  console.log('gasPrice: ', submitGasPrice)

  const txSenderInfo = { gasPrice: submitGasPrice, gas: settings.gasLimit, nonce, from: sender }
  return txSenderInfo
}

async function run() {
  await hre.run('compile')

  process.on('uncaughtException', function (err) {
    // handle the error safely
    console.log('ERROR: Uncaught exception (likely, Infura?)', err)
    process.exit(1)
  })

  process.on('unhandledRejection', function (err) {
    console.log('ERROR: Unhandled promise rejection (likely, Infura?)', err)
    process.exit(2)
  })

  const accounts = await ethers.getSigners()
  console.log('_____ProfitShare__________________________________________________')
  let sender = accounts[0].address

  try {
    await profitShare.profitShareLoop(web3, await formulateTxSenderInfo(sender))
  } catch (e) {
    console.log('profitShare: profitShareLoop error:', e)
  }

  console.log('_____sETH2 Claimer________________________________________________')

  try {
    await sEthClaimer.claimRewardsLoop(web3, await formulateTxSenderInfo(sender))
  } catch (e) {
    console.log('sEthClaimer: claimRewardsLoop error:', e)
  }

  process.exit(0) // this exits the process whenever the main loop has ended
}

run()
