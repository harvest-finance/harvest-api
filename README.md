# harvest-api

This repository contains implementation and documentation of the API used by [Harvest.finance](https://harvest.finance).

## Documentation

- See [API Documentation](./docs/api.md) for supported routes
- See [Developer Documentation](./docs/developer.md) for developer info
- Miscellaneous
  * [Some info on APR and APYs](./docs/apr-and-apy.md)

## Minimal recommended setup

1. `yarn`
2. Install and start MongoDB (for local cache). [Instructions for Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
3. `export INFURA_KEY=<infuraKey>`
5. `export MATIC_INFURA_KEY=<infuraKey that has Polygon/Matic enabled>`. If omitted, will still work for BSC and Ethereum Mainnet (but tests will fail).
6. `npm start`. It takes a few minutes to start fresh. Then, can query:
    1. Vaults: `http://localhost:3000/vaults?key=harvest-key`
    2. Pools: `http://localhost:3000/pools?key=harvest-key`
    3. General data (staked amount, monthly profits, etc.): `http://localhost:3000/token-stats?key=harvest-key`
    4. API originally designed for CoinMarketCap: `http://localhost:3000/cmc?key=harvest-key`

## Debugging a specific vault/pool

* `npm run print-vault -- WETH` will output vault and pool information. IDs should match a vault in [tokens](./data/mainnet/tokens.js) and/or a pool in [pools](./data/mainnet/pools.js)

## Running tests

* `npm t`. However, the test suite could use more assertions

## Areas of improvements

* Adding more assertions for the tests and more coverage
