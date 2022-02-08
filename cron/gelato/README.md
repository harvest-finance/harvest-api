# Hardhat Gelato Resolver
1. setup `dev-keys.json`

```
## `dev-keys.json`
```
{
  "alchemyKey": "<your key>"
}
```

### Permissions

Controller has to whitelist the deployed Resolver as hardworker.


### Tests

- use block 23880727 as example for non-profitability
- use block 24223199 as example for profitability

```
npx hardhat test test/resolver.js
```