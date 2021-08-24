const { get } = require('lodash')
const { startOfMinute, subDays } = require('date-fns')
const { SUSHI_GRAPHQL_ENDPOINTS, SUSHI_GRAPHQL_ENDPOINTS_TYPES } = require('../constants')
const { cachedAxios } = require('../db/models/cache')

const executeSushiCall = (type, query, variables) =>
  cachedAxios
    .post(SUSHI_GRAPHQL_ENDPOINTS[type], JSON.stringify({ query, variables }))
    .then(response => {
      const data = get(response, 'data.data')

      if (data) {
        return data
      } else {
        console.log(response)
        return null
      }
    })
    .catch(error => {
      console.error(
        `executeSushiCall(${SUSHI_GRAPHQL_ENDPOINTS[type]}, ${query}, ${variables}) failed:`,
        error,
      )
      return null
    })

const getSushiBarStats = async variables => {
  const query = `
  query barQuery($id: String! = "0x8798249c2e607446efb7ad49ec89dd1865ff4272") {
    bar(id: $id) {
      id
      totalSupply
      ratio
      xSushiMinted
      xSushiBurned
      sushiStaked
      sushiStakedUSD
      sushiHarvested
      sushiHarvestedUSD
      xSushiAge
      xSushiAgeDestroyed
    }
  }  
  `

  const queryReponse = await executeSushiCall(SUSHI_GRAPHQL_ENDPOINTS_TYPES.BAR, query, variables)
  return queryReponse
}

const getOneDayBlock = async () => {
  const date = startOfMinute(subDays(Date.now(), 1))
  const start = Math.floor(date / 1000)
  const end = Math.floor(date / 1000) + 600

  const query = `
  query blockQuery($start: Int!, $end: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $start, timestamp_lt: $end }
    ) {
      id
      number
      timestamp
    }
  }
    `

  const queryReponse = await executeSushiCall(SUSHI_GRAPHQL_ENDPOINTS_TYPES.ETH, query, {
    start,
    end,
  })
  return queryReponse
}

const getSushiFactoryTimeTravel = async variables => {
  const query = `
  query factoryTimeTravelQuery(
    $id: String! = "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac"
    $block: Block_height!
  ) {
    factory(id: $id, block: $block) {
      id
      volumeUSD
    }
  }
`

  const queryReponse = await executeSushiCall(
    SUSHI_GRAPHQL_ENDPOINTS_TYPES.EXCHANGE,
    query,
    variables,
  )
  return queryReponse
}

const getSushiFactoryStats = async variables => {
  const query = `
  query factoryQuery(
    $id: String! = "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac"
  ) {
    factory(id: $id) {
      id
      volumeUSD
    }
  }  
`

  const queryReponse = await executeSushiCall(
    SUSHI_GRAPHQL_ENDPOINTS_TYPES.EXCHANGE,
    query,
    variables,
  )
  return queryReponse
}

module.exports = {
  getOneDayBlock,
  getSushiBarStats,
  getSushiFactoryTimeTravel,
  getSushiFactoryStats,
}
