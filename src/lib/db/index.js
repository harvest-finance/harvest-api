const mongoose = require('mongoose')

const initDb = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/${
        process.env.MONGODB_DB_NAME || process.env.HEROKU_APP_NAME || 'harvest-local'
      }`,
      {
        keepAlive: true,
        useNewUrlParser: true,
        retryWrites: false,
        useUnifiedTopology: true,
      },
    )
    console.log('Connected to Mongo!')
  } catch (err) {
    console.error(`Error while connecting to Mongo: `, err)
  }
}

module.exports = initDb
