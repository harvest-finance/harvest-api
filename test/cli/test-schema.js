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
          obj[property].length > 0 &&
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

  console.log('\nChecking vaults api ....\n')
  iterate(vaults_output)
  var resultVaults = v.validate(vaults_output, VAULTS_SCHEMA)

  if (resultVaults.valid) {
    console.log('SUCCESS!')
    console.log('The vaults api output is valid.')
  } else {
    console.log('FAILURE!')
    for (let i = 0; i < resultVaults.errors.length; i++) {
      let error = resultVaults.errors[i]
      if (error.path[0] == 'bsc' || error.path[0] == 'eth' || error.path[0] == 'matic') {
        console.log(vaults_output[error.path[0]][error.path[1]].name + ': ' + error.stack)
      } else {
        console.log(error.path[error.path.length - 1] + ' ' + error.message)
      }
    }
  }

  console.log('\nChecking pools api ....\n')
  iterate(pools_output)
  var resultPools = v.validate(pools_output, POOLS_SCHEMA)

  if (resultPools.valid) {
    console.log('SUCCESS!')
    console.log('The pools api output is valid.')
  } else {
    console.log('FAILURE!')
    for (let i = 0; i < resultPools.errors.length; i++) {
      let error = resultPools.errors[i]
      if (error.path[0] == 'bsc' || error.path[0] == 'eth' || error.path[0] == 'matic') {
        console.log(pools_output[error.path[0]][error.path[1]].id + ': ' + error.stack)
      } else {
        console.log(error.path[error.path.length - 1] + ' ' + error.message)
      }
    }
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
