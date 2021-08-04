const axios = require('axios')
const { get } = require('lodash')
const { UI_URL, DB_CACHE_IDS, UI_DATA_CACHE_TTL } = require('../constants')
const axiosRetry = require('axios-retry')
const { storeData, Cache } = require('../db/models/cache')
const { cache } = require('../cache')

const uiUrl = axios.create({ baseURL: UI_URL })

axiosRetry(uiUrl, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 304),
})

const storeUIData = async (fileName, fileType = 'json') => {
  console.log(`\n-- Getting ${fileName}.${fileType} from ${UI_URL} --`)
  try {
    const uiResponse = await uiUrl.get(`/data/${fileName}.${fileType}`)
    const fetchedUIData = get(uiResponse, 'data')

    if (fetchedUIData) {
      storeData(
        Cache,
        DB_CACHE_IDS.UI_DATA,
        {
          [fileName]: fetchedUIData,
        },
        null,
      )
      cache.set(`uiData-${fileName}`, fetchedUIData, UI_DATA_CACHE_TTL)
      await new Promise(resolve => setTimeout(resolve, 1200)) // Wait 1.2s to make sure the DB is updated for the data fetching
      console.log(`-> Fetched and stored as [${fileName}]`)
    }
  } catch (err) {
    console.error(`-> Failed to fetch:`, err.message)
  }
  console.log(`-- Done getting ${fileName}.${fileType} from ${UI_URL} --`)
}

const getUIData = async fileName => {
  const cachedUIData = cache.get(`uiData-${fileName}`)

  if (cachedUIData) {
    return cachedUIData.data
  }

  const dbResponse = await Cache.findOne(
    { type: DB_CACHE_IDS.UI_DATA },
    { [`data.${fileName}.data`]: 1 },
  )
  const uiData = get(dbResponse, `data[${fileName}].data`)

  return uiData
}

const checkForUIDataUpdate = async (fileName, fileType = 'json') => {
  const uiResponse = await uiUrl.get(`/data/${fileName}.${fileType}`)
  const fetchedUIData = get(uiResponse, 'data')

  const fetchedUpdatedAt = fetchedUIData.updatedAt
  let currUpdatedAt

  const cachedUIData = cache.get(`uiData-${fileName}`)

  if (cachedUIData) {
    currUpdatedAt = cachedUIData.updatedAt
  } else {
    const dbResponse = await Cache.findOne(
      { type: DB_CACHE_IDS.UI_DATA },
      { [`data.${fileName}.updatedAt`]: 1 },
    )
    currUpdatedAt = get(dbResponse, `data[${fileName}].updatedAt`)
  }
  return new Date(currUpdatedAt) < new Date(fetchedUpdatedAt)
}

module.exports = { storeUIData, getUIData, checkForUIDataUpdate }
