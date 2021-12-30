# Emissions tools (Polygon)

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
  "alchemyKey": "..."
}
```

## How to run:
1. `npx hardhat view --network hardhat` to view existing emission percentages
1. Edit `../data/polygon.csv` with latest percentages
1. `npx hardhat record --network hardhat` to simulate recording emission numbers
1. `npx hardhat record --network mainnet` to execute recording emission numbers
1. `npx hardhat view --network hardhat` to view newly recorded emission percentages
1. `npx hardhat notify --network hardhat` to simulate actual notification
1. `npx hardhat notify --network mainnet` to execute actual notification
