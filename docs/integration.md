# Integrations

One way to build an integration is using [tokens.json](https://harvest.finance/data/tokens.json) and [pools.json](https://harvest.finance/data/pools.json) that contain up-to-date vault and pool information presented in the UI.

Our [API](./developer.md) currently uses the JSON files as sources of data and APY computation formulas.

## Front-end's tokens.json and pools.json

* Tokens (including vaults): https://harvest.finance/data/tokens.json
* Pools: https://harvest.finance/data/pools.json

### tokens.json

* Location: https://harvest.finance/data/tokens.json
* Example data:

```
WBTC: {
  chain: "1",                    // chain ID: "1" = Ethereum, "56" = BSC, "137" = Polygon (Matic)
  logoUrl: "./icons/wbtc.png", // path to the logo (relative to https://harvest.finance/)
  tokenAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // token address
  decimals: "8",                                              // number of decimals
  vaultAddress: "0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB", // vault address
  priceFunction: {                                            // how to calculate the price of this token
    type: "COINGECKO_CONTRACT",   // the "type" which is implemented in the API code
    params: [                     // parameters passed into the formula
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    ]
  },
  cmcRewardTokenSymbols: [        // originally introduced for displaying Harvest.finance
                                  // on CoinMarketCap (CMC)
    "FARM",                       // defines which tokens are displayed as "rewards" on CMC
    "WBTC"
  ],
  estimateApyFunctions: [{        // how calculate the APY of each reward tokens from the farming opportunity
    type: "IDLE_FINANCE",         // Note: only reward tokens from the opportunity are specified here
                                  // no FARM, etc. as they belong to the pool (in pools.json), not the vault
    params: [                     // parameters passed into the APY calculation function
      "WBTC",
      "0x8C81121B15197fA0eEaEE1DC75533419DcfD3151",
      true,
      0.7                         // typically represents the 30% deduction
    ]
  }]
},
...
```

### pools.json

* Location: https://harvest.finance/data/pools.json
* Example data:

```
{
  chain: "1",        // chain ID: "1" = Ethereum, "56" = BSC, "137" = Polygon (Matic)
  id: "farm-wbtc", // a unique arbitrary id
  type: "INCENTIVE",
  contractAddress: "0x917d6480Ec60cBddd6CbD0C8EA317Bcc709EA77B", // address
      // of the reward pool (a deployed instance NoMintRewardPool or PotPool)
  collateralAddress: "0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB", // address
      // of the staking token (it is the f-token fWBTC, same as vaultAddress in vaults.json)
  rewardTokens: [ // reward tokens - for PotPools, there could be multiple
    "0xa0246c9032bC3A600820415aE600c6388619A14D"
  ],
  rewardTokenSymbols: [ // display symbols of reward tokens
    "FARM"
  ]
},
...
```
