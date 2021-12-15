// main event loop
async function profitShareLoop(web3, txSenderInfo) {
  let abi = require('../abi/INotifyHelper.json')
  let helperAddress = '0xE20c31e3d08027F5AfACe84A3A46B7b3B165053c'
  let notifyHelper = new web3.eth.Contract(abi, helperAddress)
  let lastTimestamp = await notifyHelper.methods.lastProfitShareTimestamp().call()
  let now = Math.floor(Date.now() / 1000)
  if (now - lastTimestamp > 86400) {
    console.log('Calling notification.')
    await notifyHelper.methods.notifyProfitSharing().send(txSenderInfo)
  } else {
    console.log(
      `Not enought time elapsed. Now is ${now} and we last called at ${lastTimestamp}. Next call will be at ${
        Math.floor(lastTimestamp) + 86400
      }`,
    )
  }
}

module.exports = {
  profitShareLoop,
}
