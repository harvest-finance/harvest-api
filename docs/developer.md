# API

The front-end of [Harvest.finance](https://harvest.finance) is accompanied by the API hosted on https://api.harvest.finance/ and https://api-ui.harvest.finance/.

## Why is API necessary?

The API:
1. Encapsulates the formulas and logic necessary for APY computations to keep the front-end code clean
2. Frees up the front-end from excessive CPU and memory load by doing all the computations and caching the results globally
3. Provides data for list of farming opportunities on websites like CoinMarketCap.

## Where is API deployed?

The API is currently deployed in two separate instances sharing the same code base (but different paths are active depending on the environment):
1. https://api-ui.harvest.finance/ - exposes functions originally intended for use by `https://harvest.finance` exclusively
2. https://api.harvest.finance/ - exposes data originally intended for public use (CoinMarketCap, third parties, etc.)

Both endpoints are public, but the format of https://api-ui.harvest.finance/ is subject to change at any point while the intention for https://api.harvest.finance/ is  relatively stable.

When run locally, all paths are active by default.

## Is there access control?

The API is public, and the authentication key is publicly available as well since there is no private information to protect. In the future, access control may be changed.

## What API does

The API, on the hourly basis, does the following:
1. Runs the necessary computations in formulas by querying third-party APIs, including `Coingecko` (for prices data), `Infura` (for computations using on-chain data), and APIs exposed by farming opportunities (such as, `apy.vision`, `Convex`, `curve.fi`, `Idle.finance`)
2. Caches the individual terms as well as the results of the computation in memory and in the database.

## Is there database?

The MongoDB-compatible database is purely used for caching. It can be cleared and re-created at any time.

## Code overview

All source is located in the `src` folder.
* `src/lib/*`: Shared supplementary methods, constants, and db/cache management
* `src/data/*`: All the information about vaults, pools, and associated contract addresses consumed by the UI
* `src/lib/data/addresses.json`: Ethereum addresses of general frequently-used smart contracts. It intends to not duplicate or hard-code any data already contained in front-end's `tokens.json` or `pools.json`.
* `src/lib/constants.js`: Some constants and declarations.
* `src/prices/*`: Encapsulates formulas for price computations
* `src/pools`: Logic related to pools, which includes pool APY computations
* `src/vaults`: Logic related to vaults
* `src/vaults/apys/*`: Implementations of APY computation formulas for vaults.
* `src/vaults/trading-apys/*`: Implementations of trading APY (liquidity provider APY) computation formulas for vaults.
* `src/runtime/router/*`: Route definitions, boilerplate code, and middleware of the web service.
* `src/runtime/pollers.js`: Pollers that run periodically (asynchronously to the web service), fetch and cache the data.


### Environment variables

Name | Description | Example (or default value)
--- | --- | ---
PORT | The port on which to run the API  | 3000
INFURA_KEY | Infura access key |
API_KEY | The authentication token that needs to be appended to all queries on this API | 'harvest-key'
UPDATE_LOOP_INTERVAL_MS | Interval for polling to update the data (refresh caches) | Default: 1 Hour
ACTIVE_ENDPOINTS | Selecting which routes to make active (`api.harvest.finance` and `api-ui.harvest.finance` exposing different set of routes) |  Default: `ENDPOINT_TYPES.INTERNAL`
CG_CACHE_TTL | caching TTL for Coingecko requests | Default: 10 Min
GENERAL_CACHE_TTL | caching TTL for general responses  | Default: 10 Min
BSC_RPC_URL | Blockchain node endpoint for Binance Smart Chain | `'https://bsc-dataseed2.binance.org/'`
MATIC_RPC_URL | Blockchain node endpoint for Polygon (Matic) | `https://polygon-mainnet.infura.io/v3/${MATIC_INFURA_KEY}`
MATIC_INFURA_KEY | Infura key used in case of default MATIC_RPC_URL |
DEBUG_MODE | Computes and exposes some debug-only information | `false`
MONGODB_URI  | MongoDB connection string | `mongodb://127.0.0.1:27017`
MONGODB_DB_NAME  | MongoDB database name | `harvest-local`

## How to contribute?

1. Fork the repository, make a change and test locally
2. Open a pull request with a detailed description of the purpose of the PR
3. Wait for the CI to finish and fix any issues
4. If the change is deemed as necessary/useful by the team, it will be merged and promoted.
