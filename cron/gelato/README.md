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

```
npx hardhat test test/resolver.js
```