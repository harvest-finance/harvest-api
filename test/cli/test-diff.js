require('dotenv').config()
const initDb = require('../../src/lib/db')
const { clearAllDataTestOnly, Cache } = require('../../src/lib/db/models/cache')
const app = require('../../src/runtime/app')
const axios = require('axios')
const { sleep } = require('../integration/utils')
const Diff = require('text-diff')
const fs = require('fs')

const PORT = 3000
const harvestKey = 'harvest-key'
const productionKey = '41e90ced-d559-4433-b390-af424fdc76d6'
const CSS = '<style>del {background:#ffe6e6;} ins { background:#e6ffe6; }</style>'

const responseToString = response => {
  return JSON.stringify(response.data, null, 4)
}

const main = async () => {
  console.log('Diff started.')

  console.log('Loading server....')

  let appServer
  await initDb()
  await clearAllDataTestOnly(Cache)

  appServer = app()

  let response = {
    data: {},
  }
  while (Object.keys(response.data).length < 3) {
    response = await axios.get(`http://localhost:${PORT}/cmc?key=${harvestKey}`)
    console.log('Still loading. Waiting...')
    await sleep(10000)
  }

  console.log('Comparing the outputs....')

  let diff = new Diff()

  console.log('compare vaults')
  const repVault1 = await axios.get(`http://localhost:${PORT}/vaults?key=${harvestKey}`)
  const repVault2 = await axios.get(`http://api-ui.harvest.finance/vaults?key=${productionKey}`)

  const diffVault = diff.main(responseToString(repVault1), responseToString(repVault2))
  console.log(`${diffVault.length} changes found in vaults api`)
  if (diffVault.length > 0) {
    const diffHtmlVault = diff.prettyHtml(diffVault) + CSS
    fs.writeFile('diff_vault.html', diffHtmlVault, function (err) {
      if (err) return console.log(err)
      console.log('Vault compares are written to diff_vault.html')
    })
  }

  console.log('compare pools')
  const repPool1 = await axios.get(`http://localhost:${PORT}/pools?key=${harvestKey}`)
  const repPool2 = await axios.get(`http://api-ui.harvest.finance/pools?key=${productionKey}`)

  const diffPool = diff.main(responseToString(repPool1), responseToString(repPool2))
  console.log(`${diffPool.length} changes found in vaults api`)
  if (diffPool.length > 0) {
    const diffHtmlPool = diff.prettyHtml(diffPool) + CSS
    fs.writeFile('diff_pool.html', diffHtmlPool, function (err) {
      if (err) return console.log(err)
      console.log('Pool compares are written to diff_pool.html')
    })
  }

  appServer.close()
  console.log('Diff completed.')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
