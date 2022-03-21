# Emissions tools (BSC)

## One-time setup:
Set up `settings.json` and `dev-keys.json` (place `dev-keys.json` right OUTSIDE your `harvest-api` repository folder)

1. `settings.json`
```
{
  "gasPrice": "51000000000",
  "gasLimit": "7000000"
}
```
1. `dev-keys.json`
```
{
  "mnemonic": "<your mnemonic>",
  "getBlockKey": "..."
}
```

## How to run:
1. Edit `../data/bsc.csv` with latest percentages
1. `npx hardhat record --network mainnet` to execute recording emission numbers
1. `npx hardhat update-totals --network mainnet` to update the totals
1. `npx hardhat execute --network mainnet` to execute the emissions

## Other commands
1. `npx hardhat view --network hardhat` to view newly recorded emission percentages
1. `npx hardhat old-notify --network hardhat` to simulate actual notification
1. `npx hardhat old-notify --network mainnet` to execute actual notification
