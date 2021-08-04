# Background

In general, there are two notions: APR and APY. Both relate to some kind of a profit-generating account (such as a savings account, or a staking pool) where you need to deposit something, and will get something more back.
APR is annualized, so it tells us how much of yield, with respect to the deposit, I will get in 1 year. For example, if I had a savings account where I put 100 `EUR` and in one year, it will give me 100 `EUR` back plus additional 100 `EUR`, it would have APR of 100%. If if gave me 50 `EUR` on top of my deposit, we would have 50% APR. So to get the APR, we need one piece of information: How much yield will I get in 1 year on top of my deposit. In a formula:

`APR = (yield / deposit) x 100`

APY differs from APR by including compounding effects. If your account gives you 100% yield in one year, and if you were to withdraw your yield after 1 month, you would be able to increase your pr
ofit in the following month (you would be getting yield from your yield). And if you did it every month, you would make more and more. But of course, if you were to compound weekly, you would make
 more, and if you were to compound daily, you would get even more. So, for calculating APY, we need to know APY plus the frequency of compounding. The formula for monthly compounding would be:

`APY = (1 + APR / 12)^12 - 1`

where 50% APR would be **expressed as 0.5**, and the magic number 12 would represent the number of compounds (12 for 12 months in 1 year). If we did weekly compounding, we would have 52 compounds, and
 if we did daily, we would have 365 compound periods, and if we did some number R, we would have:

`APY = (1 + APR / R)^R - 1.`

The would give us the APY in percents.

As you can see, I used `EUR` for calculating, but did not use the unit anywhere. If we were calculating in `USD`, `ETH`, `BTC`, `DAI` or anything else, the formulas would be the same. The unit does not matt
er, as long as the deposit and the reward uses the same unit. In this sense, APR is abstract. Similarly, it does not matter if the pool is a savings account, `SNX` pool, `Curve` pool, `Uniswap` pool, or
 anything else. As long as we know how much it will give us in a year for our deposit, we can calculate the APR.

In our case, the units are usually not the same. For example, you stake `WBTC` to get `USDC` as a reward. In this case, we need to choose one, either the deposit or reward, and convert them. Or we can choose some neutral unit, such as USD, and covert both into that unit. We can do that by querying the APIs such as Coingecko, or by querying Uniswap via web3. Since the deposits and rewards are often LP tokens whose price is not tracked anywhere, we need to understand how they are created and how to determine their values (and that we can discuss next time).

The part of "How much will the pool give us in 1 year" depends on a few things. The most frequent rewards pool that we work with is so-called SNX pool. This pool operates on a fixed period of time such as a week, or a month, or a year), and during that time, it hands out all the rewards it has to its depositors, proportionally to their deposits. So, if I had an `SNX` pool that operates on a weekly basis and has 100 `WBTC` staked in it, and will hand out 1000 `USDC` in that week, and if this did not change, I would know that in 1 year, the pool will hand out 1000 x 52 `USDC` for a deposit of 100 `WBTC`. Then I could convert these to a common unit, and calculate the APY.

All Harvest's pools are `SNX` pools that operate on weekly basis. For non-Harvest pools, the basic question you always need to ask is whether they are `SNX`, and if they are not `SNX`, then how do they hand out rewards, i.e., how much will they generate in 1 year, and if the yield is proportional to deposits, how much is deposited in them right now.
Given the above, the following from the ui-tickets should be easy to calculate from scratch with pen and paper:

```
add the `LUNA` APY to the `mASSET` pools 6841 `LUNA` per week overall, 1710.25 `LUNA` per pool per week
The `LUNA` accrued for each cycle is distributed using a multi-send once per week
```

We need to pick an mAsset, such as the `USDT-mAAPL` pool that we have, and see how much it has deposited in it. Then this pool will give 1710.25 x 52 `LUNA` in one year. Then we convert to the same unit, apply the APR formula, apply the compounding, and we have the APY.

# Implementation Details

Most vaults on our website show APYs consisting of two components. For example:

`CRV:STETH`: `38.47%`: `Auto harvested CRV 37.68% + FARM rewards 0.79%`

1. Native APY (`37.68%`): reflects the crop yields for a given vault.
2. Farm APY (`0.79%`): reflects an estimated amount of FARM.

## Native APR

Native APY calculation formulas depend on the protocol being farmed.
Many protocols use SNX-style reward pools. The formula for APR:

```
reward_rate (extrapolated to one year)
  x reward_token_price_in_usd
  / reward_pool_lp_token_total_supply
  / lp_token_price_in_usd
```

In our protocol, `30%` of all gains from the crops are sent to the profit-sharing pool.
Therefore, all computed native APRs are reduced by 30% (we simply multiply by `0.7`). We call it `Native Reduced APR`.

## Native Reduced APR -> APY

Crops are farmed daily: the bot calls `doHardwork()` typically once a day.
For high-yield and high-volatility vaults, sometimes the frequency is higher, for low-yield, it is lower.
However, on average, the following happens to each crops daily:
1. Claiming the crop.
2. 30% of the crop value is converted into FARM and sent to the profit-sharing pool.
3. 70% of the crop value is converted into the underlying token (e.g., ETH-WBTC) and re-invested into the vault.

Since the new crop is taking part in further reward generation, and we consider one day
as the period, the APY is the native APR reduced by 30% and compounded *daily*:

```
dailyCompound(apr) = (1 + (apr% / 36500%)^365 - 1) * 100%
apy = dailyCompound(nativeReducedAPR)
```

There are exceptions to the 70% re-investment: the buyback pools. For buyback pools, 30% is sent to the profit sharing pool,
and 70% is also converted into FARM and sent to the corresponding FARM reward pool. Since the value is not being re-invested
into the vault, there is no compounding in this case.

## FARM APY

Our reward pools are based on SNX reward pool, therefore, we use the same formula for FARM APR.

The FARM profit-sharing pool re-invests the FARM every time someone stakes or unstakes from the pool.
The calculations use an assumption that it happens, on average, *daily*.
Therefore, we use **daily** compounding for computing the APY (the formula is `apy` above).

All other FARM pools use **weekly** compounding: this is based upon an assumption made earlier last year
that rational farmers would, on average, claim the FARM earned weekly and re-invest this into the
vault or the profit-sharing pool. There was a debate on whether or not this needs to remain this way.
The formula for weekly compounding:

`weklyCompound(apr) = (1 + (apr% / 52 / 100%)^52 - 1) * 100%`

## How supply APYs/ fees / lend rates are considered

1. For strategies investing in Compound and claiming the COMP crops, the supply APY is outside the compounding brackets:
`supply_apy + dailyCompound(COMP_apy * 0.7)`. Supply APY and Comp APY are sourced from https://api.compound.finance/api/v2/ctoken.

1. For Uniswap strategies, trading fees are also outside of the compounding brackets, e.g, the ETH-DPI pool.
Uniswap (also Sushi and 1inch) trading fees are sourced from https://stats.apy.vision/api/v1, for example: https://stats.apy.vision/api/v1/pools/0x4d5ef58aAc27d99935E5b6B4A6778ff292059991.

1. For Curve, APY consists of two components: "Pool APY + Lend APY" and "CRV lp annualized APY".
The "Pool APY + Lend APY" component value is sourced from curve.fi's API whenever possible, e.g.: http://pushservice.curve.fi/apys/3pool (the API is unclear whether this is an APR or APY).
If there is no documented endpoint for a certain pool, we had to hard-code the value and periodically update it (however, not frequently).
If there is a good source for these values, would be great to incorporate. This component is currently inside the compounding brackets.

1. The "CRV lp annualized APY" component is computed using the formula taken from the Curve.fi's front page's code. The formula is rather complex
because it involves the concepts of working balance and working supply of the strategies. However, when testing, we observed it yielding the
accurate results matching the Curve.fi's website.
This portion is multiplied by `0.7` as discussed above as 30% of `CRV` is sent to the profit-sharing pool.
