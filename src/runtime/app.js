require('dotenv').config()

module.exports = function () {
  const express = require('express')
  const Sentry = require('@sentry/node')
  const Tracing = require('@sentry/tracing');
  const { initRouter } = require('./router/index')
  const { PORT, CORS_SETTINGS } = require('../lib/constants')

  const app = express()
  const cors = require('cors')
  const { startPollers } = require('./pollers')
  const initDb = require('../lib/db')

  Sentry.init({ 
    dsn: 'https://5b026dfe0a1c4d1bbb22cc70404a77f5@o1177516.ingest.sentry.io/6276522',
    integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Sample rate can be set as a decimal between 0 and 1
    // representing the percent of transactions to record
    //
    // For our example, we will collect all transactions
    tracesSampleRate: 1.0,
  });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  app.use(cors(CORS_SETTINGS))

  initRouter(app)
  
  const server = app.listen(PORT, async () => {
    await initDb()
    console.log(`Harvest API listening on port: ${PORT}`)
    startPollers(Sentry)
  })
  app.use(Sentry.Handlers.errorHandler());
  
  server.on('close', function () {
    // close all ongoing activities, but giving 10s to be able to show errors when running tests
    console.log('Harvest API received Close event. Closing down in 5s...')
    setTimeout(() => {
      process.exit(1)
    }, 5000)
  })

  return server
}
