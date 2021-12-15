const assert = require('assert')
const fs = require('fs')

function convertFrom(csvParse, filePath, vaultsObject) {
  return new Promise(resolve => {
    let items = []
    const parse = csvParse.parse
    const parser = parse({
      delimiter: ';',
      from: 2, // ignore header
    })
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let record
      while ((record = parser.read()) !== null) {
        const id = record[0]
        assert(vaultsObject[id], 'Unknown id ' + id)
        const item = {
          id,
          sourcePercentage: `${record[1]}%`,
          address: vaultsObject[id].NewPool,
          percentage: String(record[1] * 100),
        }
        assert(item.address, 'No pool defined for ' + id)
        items.push(item)
      }
    })
    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message)
    })
    parser.on('end', function () {
      console.log(JSON.stringify(items, null, 2))
      resolve(items)
    })
    parser.write(fs.readFileSync(filePath))
    parser.end()
  })
}

module.exports = {
  convertFrom,
}
