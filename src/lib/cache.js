const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 1300 })

module.exports = { cache }
