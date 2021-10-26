require('dotenv').config()
const { UI_DATA_FILES } = require('../../src/lib/constants')
const initDb = require('../../src/lib/db')
const { fetchAndExpandVault } = require('../../src/vaults')
const { fetchAndExpandPool } = require('../../src/pools')
const { cliPreload } = require('../../src/runtime/pollers')
const { getUIData } = require('../../src/lib/data')

const main = async () => {
  const vaultId = process.argv[2]

  console.log('vault/pool:', vaultId)

  await initDb()
  await cliPreload()
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const pools = await getUIData(UI_DATA_FILES.POOLS)
  let vault = null

  try {
    console.log('====================')
    console.log('fetching vault...')
    if (!tokens[vaultId]) {
      console.log(`Vault: ${vaultId} does not exist. Is casing correct?`)
    } else {
      vault = await fetchAndExpandVault(vaultId)
      console.log(vault)
    }
  } catch (err) {
    console.log(`Error getting vault ${vaultId}:`, err)
  }

  try {
    console.log('fetching pool...')
    const poolToFetch = pools.find(
      pool =>
        pool.id === vaultId ||
        (pool.collateralAddress &&
          tokens[vaultId] &&
          (!vault || tokens[vaultId].chain === pool.chain) &&
          tokens[vaultId].vaultAddress &&
          pool.collateralAddress.toLowerCase() === tokens[vaultId].vaultAddress.toLowerCase()),
    )
    const pool = await fetchAndExpandPool(poolToFetch)
    console.log('====================')
    console.log(pool)
  } catch (err) {
    console.log(`Error getting pool ${vaultId}`, err)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
