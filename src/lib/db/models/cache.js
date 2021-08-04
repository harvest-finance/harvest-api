const mongoose = require('mongoose')
const { DB_CACHE_IDS } = require('../../constants')
const { get } = require('lodash')

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
    console.error(`Could not fetch ${dbSchema}:${type}. Check for errors.`)
    return null
  }

  return result
}

const clearAllDataTestOnly = async dbSchema => {
  console.log('Clearing the DB...')
  await dbSchema.collection.deleteMany({})
}

module.exports = {
  Cache: mongoose.model('cache', CacheSchema),
  storeData,
  loadData,
  clearAllDataTestOnly,
}
