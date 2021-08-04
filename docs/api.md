# Harvest API

## Authentication

Harvest API requires an API key, append `?key=harvest-key` (or a custom key) to a request to authenticate it.

## Endpoints

### Used by harvest.finance front-end ("internal")

Use `export ACTIVE_ENDPOINTS=internal`

**Vaults**

- Path: `/vaults`
- Returns: All vaults with APYs and
- Live: https://api-ui.harvest.finance/vaults?key=41e90ced-d559-4433-b390-af424fdc76d6

**Pools**

- Path: `/pools`
- Returns: All pools with their APYs, total supply, TVL, etc.
- Live: https://api-ui.harvest.finance/pools?key=41e90ced-d559-4433-b390-af424fdc76d6

**General stats**

- Path: `/token-stats`
- Returns: General data (staked amount, monthly profits, etc.)
- Live: https://api-ui.harvest.finance/token-stats?key=41e90ced-d559-4433-b390-af424fdc76d6

### Exposed for external services ("external")

Use `export ACTIVE_ENDPOINTS=external`

**CoinMarketCap data**

- Path: `/cmc`
- Returns: Get all vaults with their APYs in the format expected by CoinMarketCap
- Live: https://api.harvest.finance/cmc?key=fc8ad696-7905-4daa-a552-129ede248e33

**Total Revenue**

- Path: `/revenue/total`
- Returns: Total estimated yearly revenue across all vaults
- Live: https://api.harvest.finance/revenue/total?key=fc8ad696-7905-4daa-a552-129ede248e33

**Token Revenue**

- Path: `/revenue/[tokenSymbol]`
- Returns: Estimated revenue for a given `tokenSymbol`
- Live: https://api.harvest.finance/revenue/DAI?key=fc8ad696-7905-4daa-a552-129ede248e33


**Total GMV**

- Path: `/gmv/total`
- Returns: Total value deposited (total farming balance) across all assets in vaults
- Live: https://api.harvest.finance/gmv/total?key=fc8ad696-7905-4daa-a552-129ede248e33

**Token GMV**

- Path: `/gmv/[tokenSymbol]`
- Returns: Total value deposited for a given `tokenSymbol`
- Live: https://api.harvest.finance/gmv/DAI?key=fc8ad696-7905-4daa-a552-129ede248e33

**Token APY**

- Path: `/apy/[tokenSymbol]`
- Returns: APY for a given `tokenSymbol`
- Live: https://api.harvest.finance/apy/DAI?key=fc8ad696-7905-4daa-a552-129ede248e33
