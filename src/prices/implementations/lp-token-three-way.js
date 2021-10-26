const { getWeb3 } = require('../../lib/web3')

const { get } = require('lodash')
const BigNumber = require('bignumber.js')

const { token: tokenContractData } = require('../../lib/web3/contracts')
const { UI_DATA_FILES } = require('../../lib/constants')
const { getUIData } = require('../../lib/data')
const { getTokenPrice } = require('..')

const getPrice = async (
  tokenContractAddress,
  firstToken,
  secondToken,
  thirdToken,
  sanctuaryContractAddress,
) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const {
    methods: { getTotalSupply, getBalance },
    contract: { abi },
  } = tokenContractData

  if (!sanctuaryContractAddress) {
    // sanctuaryContractAddress = where firstToken, secondToken, thirdToken are stored
    sanctuaryContractAddress = tokenContractAddress
  }

  const chainId = get(tokens, `[${firstToken}].chain`)
  const web3Instance = getWeb3(chainId)

  const firstInstance = new web3Instance.eth.Contract(abi, tokens[firstToken].tokenAddress)
  const allFirstAssetInWei = new BigNumber(
    await getBalance(sanctuaryContractAddress, firstInstance),
  )

  const secondInstance = new web3Instance.eth.Contract(abi, tokens[secondToken].tokenAddress)
  const allSecondAssetInWei = new BigNumber(
    await getBalance(sanctuaryContractAddress, secondInstance),
  )

  const thirdInstance = new web3Instance.eth.Contract(abi, tokens[thirdToken].tokenAddress)
  const allThirdAssetInWei = new BigNumber(
    await getBalance(sanctuaryContractAddress, thirdInstance),
  )

  const tokenInstance = new web3Instance.eth.Contract(abi, tokenContractAddress)
  const totalSupplyInWei = new BigNumber(await getTotalSupply(tokenInstance))

  const pricePerFirstAsset = new BigNumber(await getTokenPrice(firstToken))
  const pricePerSecondAsset = new BigNumber(await getTokenPrice(secondToken))
  const pricePerThirdAsset = new BigNumber(await getTokenPrice(thirdToken))

  if (totalSupplyInWei.isEqualTo(0)) {
    return new BigNumber('0')
  }

  const allFirstAssetInUSD = pricePerFirstAsset
    .multipliedBy(allFirstAssetInWei)
    .dividedBy(totalSupplyInWei)
    .multipliedBy(new BigNumber(10).exponentiatedBy(18 - tokens[firstToken].decimals))

  const allSecondAssetInUSD = pricePerSecondAsset
    .multipliedBy(allSecondAssetInWei)
    .dividedBy(totalSupplyInWei)
    .multipliedBy(new BigNumber(10).exponentiatedBy(18 - tokens[secondToken].decimals))

  const allThirdAssetInUSD = pricePerThirdAsset
    .multipliedBy(allThirdAssetInWei)
    .dividedBy(totalSupplyInWei)
    .multipliedBy(new BigNumber(10).exponentiatedBy(18 - tokens[thirdToken].decimals))

  const res = allFirstAssetInUSD.plus(allSecondAssetInUSD).plus(allThirdAssetInUSD).toString(10)
  return res
}

module.exports = {
  getPrice,
}
