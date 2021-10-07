const mongoose = require('mongoose')
const axios = require('axios')
const { DB_CACHE_IDS } = require('../../constants')
const { get } = require('lodash')
const stringHash = require('string-hash')

const CacheSchema = new mongoose.Schema({
  type: {
    type: Number,
    enum: [DB_CACHE_IDS.VAULTS, DB_CACHE_IDS.POOLS, DB_CACHE_IDS.STATS, DB_CACHE_IDS.CMC],
  },
  data: { type: mongoose.Schema.Types.Mixed, default: [] },
  updatedAt: { type: Date, default: new Date() },
})

const storeData = (dbSchema, type, data, hasErrors, upsert = true) => {
  if (hasErrors) {
    console.error(
      `Something went wrong during the ${
        Object.keys(DB_CACHE_IDS)[type]
      } loops. Skipping the storing in the database.`,
    )
    return
  }

  return dbSchema.collection.updateOne(
    {
      type,
    },
    [{ $addFields: { data, updatedAt: new Date() } }],
    { upsert },
  )
}

const loadData = async (dbSchema, type) => {
  const dbResponse = await dbSchema.collection.findOne({ type })
  const result = get(dbResponse, 'data', null)

  if (!result) {
    console.error(`Could not fetch ${type}. Check for errors.`)
    return null
  }

  return result
}

const clearAllDataTestOnly = async dbSchema => {
  console.log('Clearing the DB...')
  await dbSchema.collection.deleteMany({})
}

const cachedAxios = {
  post: async (...params) => {
    const cacheKey = `${params[0].replace(/\W/g, '')}-${stringHash(JSON.stringify(params))}`

    try {
      const response = await axios.post(...params)

      await storeData(mongoose.model('cache', CacheSchema), DB_CACHE_IDS.EXTERNAL_API, {
        [cacheKey]: {
          data: JSON.stringify(response.data),
          updatedAt: new Date(),
        },
      })

      return response
    } catch (err) {
      console.error(`axios post error with params: ${params}, loading cached data`, err)

      const cachedData = await loadData(
        mongoose.model('cache', CacheSchema),
        DB_CACHE_IDS.EXTERNAL_API,
      )

      return Promise.resolve({ data: JSON.parse(cachedData[cacheKey].data) })
    }
  },
  get: async (...params) => {
    const cacheKey = `${params[0].replace(/\W/g, '')}-${stringHash(JSON.stringify(params))}`

    try {
      const response = await axios.get(...params)

      await storeData(mongoose.model('cache', CacheSchema), DB_CACHE_IDS.EXTERNAL_API, {
        [cacheKey]: {
          data: JSON.stringify(response.data),
          updatedAt: new Date(),
        },
      })

      return response
    } catch (err) {
      console.error(`axios get error with params: ${params}, loading cached data`, err)

      const cachedData = await loadData(
        mongoose.model('cache', CacheSchema),
        DB_CACHE_IDS.EXTERNAL_API,
      )

      return Promise.resolve({ data: JSON.parse(cachedData[cacheKey].data) })
    }
  },
}

module.exports = {
  Cache: mongoose.model('cache', CacheSchema),
  storeData,
  loadData,
  clearAllDataTestOnly,
  cachedAxios,
}
