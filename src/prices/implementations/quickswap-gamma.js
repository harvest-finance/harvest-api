const axios = require('axios')
const { get } = require('lodash')
const { QUICKSWAP_GAMMA_ENDPOINT } = require('../../lib/constants')
const BigNumber = require('bignumber.js')

const getPrice = async poolAddress => {
    let price = 0,
        response
    try {
        response = await axios.get(`${QUICKSWAP_GAMMA_ENDPOINT}hypervisors/allData`)
        const tvlUSD = get(response, `data.${poolAddress.toLowerCase()}.poolTvlUSD`, 0)
        let totalSupply = get(response, `data.${poolAddress.toLowerCase()}.totalSupply`, 0)
        totalSupply = new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(18))
        if (totalSupply && totalSupply > 0) {
            price = parseFloat(tvlUSD) / totalSupply.toFixed()
        }
    } catch (e) {
        console.error('Gamma API error: ', e)
        price = 0
    }

    return price.toString()
}

module.exports = {
    getPrice,
}
