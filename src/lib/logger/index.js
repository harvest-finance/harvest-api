const Sentry = require('@sentry/node')

const logger = () => {
  Sentry.init({
    dsn: 'https://5b026dfe0a1c4d1bbb22cc70404a77f5@o1177516.ingest.sentry.io/6276522',
    integrations: [
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
    ],

    // Sample rate can be set as a decimal between 0 and 1
    // representing the percent of transactions to record
    //
    // For our example, we will collect all transactions
    tracesSampleRate: 1.0,
  })

  return Sentry
}
const sentry = logger()

module.exports = { sentry }
