const data = require('../../../data')

const getUIData = async fileName => {
  return data[fileName]
}

module.exports = { getUIData }
