require('dotenv').config()

module.exports = function () {
  const https = require('node:https')
  const http = require('node:http')
  const express = require('express')
  const { initRouter } = require('./router/index')
  const { CORS_SETTINGS } = require('../lib/constants')

  const app = express()
  const cors = require('cors')
  const { startPollers } = require('./pollers')
  const initDb = require('../lib/db')

  app.use(cors(CORS_SETTINGS))

  initRouter(app)

  const httpsPort = process.env.HTTPS_PORT || 443
  const httpPort = process.env.HTTP_PORT || 80

  let server, port

  if (process.env.NODE_ENV === 'production') {
    server = https.createServer(
      {
        cert: process.env.ORIGIN_SERVER_CERT?.replace(/\n/g, '\n'),
        key: process.env.ORIGIN_SERVER_KEY?.replace(/\n/g, '\n'),
        ca: process.env.ORIGIN_SERVER_CA?.replace(/\n/g, '\n'),
        requestCert: true,
        rejectUnauthorized: true,
      },
      app,
    )
    port = httpsPort

    http
      .createServer((req, res) => {
        res.writeHead(301, {
          Location: `https://${req.headers['host']}${req.url}`,
        })
        res.end()
      })
      .listen(httpPort, () => console.log(`HTTP->HTTPS Redirect is ready on port ${httpPort}`))
  } else {
    server = http.createServer(app)
    port = httpPort

    server.on('close', function () {
      // close all ongoing activities, but giving 10s to be able to show errors when running tests
      console.log('Harvest API received Close event. Closing down in 5s...')
      setTimeout(() => {
        process.exit(1)
      }, 5000)
    })
  }

  server.listen(port, async () => {
    await initDb()
    console.log(`Harvest API listening on port: ${port}`)
    startPollers()
  })

  return server
}
