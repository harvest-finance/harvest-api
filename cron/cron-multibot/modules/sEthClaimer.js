const axios = require('axios')

// main event loop
async function claimRewardsLoop(web3, txSenderInfo) {
  const abi = require('../abi/IsEthMerkleDistributor.json')
  const merkleAddress = '0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20'
  const vaultAddress = '0x65383Abd40f9f831018dF243287F7AE3612c62AC'
  const merkleDistributor = new web3.eth.Contract(abi, merkleAddress)
  const route = `https://api.stakewise.io/distributor-claims/${vaultAddress}/`

  const data = (await axios.get(route)).data
  if (data.index === undefined) {
    console.log('No pending rewards for the account, skipping...')
    return
  }

  const alreadyClaimed = await merkleDistributor.methods.isClaimed(data.index).call()

  if (alreadyClaimed) {
    console.log(`Already claimed ${data.index} [${alreadyClaimed}], skipping...`)
    return
  }

  /*
    uint256 index,
    address account,
    address[] calldata tokens,
    uint256[] calldata amounts,
    bytes32[] calldata merkleProof
  */

  const args = [
    data.index,
    data.account,
    data.rewards.map(item => item.reward_token),
    data.rewards.map(item => item.value),
    data.proof.split(','),
  ]

  console.log('Calling with...', data, args)

  await merkleDistributor.methods.claim(...args).send(txSenderInfo)

  console.log('Called successfully')
}

module.exports = {
  claimRewardsLoop,
}
