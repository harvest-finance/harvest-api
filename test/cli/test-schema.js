const Validator = require('jsonschema').Validator
const { POOLS_SCHEMA, VAULTS_SCHEMA } = require('../constants/json-schemas')

require('dotenv').config()
const initDb = require('../../src/lib/db')
const { clearAllDataTestOnly, Cache } = require('../../src/lib/db/models/cache')
const app = require('../../src/runtime/app')
const axios = require('axios')
const { sleep } = require('../integration/utils')

const PORT = 3000
const harvestKey = 'harvest-key'

function iterate(obj) {
  for (var property in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == 'object') {
        iterate(obj[property])
      } else {
        if (
          typeof obj[property] == 'string' &&
          !obj[property].startsWith('0x') &&
          isNaN(obj[property]) == false
        ) {
          obj[property] = Number(obj[property])
        }
      }
    }
  }
}

function objectToArray(obj) {
  let array = []

  for (const [key, value] of Object.entries(obj)) {
    array.push({ name: key, data: value })
  }

  return array
}

const main = async () => {
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

  console.log('Getting api outputs')
  const vaultsReponse = await axios.get(`http://localhost:${PORT}/vaults?key=${harvestKey}`)
  const poolsResponse = await axios.get(`http://localhost:${PORT}/pools?key=${harvestKey}`)
  const vaults_output = vaultsReponse.data
  const pools_output = poolsResponse.data

  // preprocess
  vaults_output.bsc = objectToArray(vaults_output.bsc)
  vaults_output.eth = objectToArray(vaults_output.eth)
  vaults_output.matic = objectToArray(vaults_output.matic)

  console.log('Schema validate started.')
  console.log('------------------------')

  var v = new Validator()

  console.log('Checking vaults api ....')
  iterate(vaults_output)
  var resultVaults = v.validate(vaults_output, VAULTS_SCHEMA)

  if (resultVaults.valid) {
    console.log('SUCCESS!')
    console.log('The vaults api output is valid.')
  } else {
    console.log('FAILURE!')
    console.log(resultVaults.toString())
  }

  console.log('Checking pools api ....')
  iterate(pools_output)
  var resultPools = v.validate(pools_output, POOLS_SCHEMA)

  if (resultPools.valid) {
    console.log('SUCCESS!')
    console.log('The pools api output is valid.')
  } else {
    console.log('FAILURE!')
    console.log(resultPools.toString())
  }

  console.log('------------------------')
  console.log('Schema validate ended.')

  appServer.close()
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
