const { UI_DATA_FILES } = require('../../lib/constants')
const { getUIData } = require('../../lib/data')

const validateAPIKey = concatenatedKeys => (req, res, next) => {
  const keys = concatenatedKeys.split(';')
  if (!keys.find(k => k === req.query.key)) {
    res.status(401).json({ error: 'invalid api key' })
  } else {
    next()
  }
}

const asyncWrap = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error(`asyncWrap middleware failed: ${err.toString()}`, err.stack)
    return res.status(500).json({ error: 'internal server error' })
  })

const validateTokenSymbol = async (req, res, next) => {
  const tokens = await getUIData(UI_DATA_FILES.TOKENS)
  const tokenSymbol = req.params.symbol.toUpperCase()

  if (!tokens[tokenSymbol]) {
    res.status(401).json({ error: 'invalid token symbol' })
  } else {
    next()
  }
}

module.exports = { validateAPIKey, asyncWrap, validateTokenSymbol }
