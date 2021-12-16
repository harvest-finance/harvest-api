# Emissions tools

## One-time setup:
Set up `settings.json` and `dev-keys.json`

1. `settings.json`
```
{
  "gasPrice": "51000000000",
  "gasLimit": "7000000"
}
```
1. `dev-keys.json` (place it right OUTSIDE your instance of `harvest-api` repository folder)
```
{
  "mnemonic": "<your mnemonic>",
  "alchemyKey": "..."
}
```

## How to run:
1. `npx hardhat view --network hardhat` to view existing emission percentages
1. Create `./weeks/week-<number>.csv` with latest percentages
1. `npx hardhat record --week <number> --network hardhat` to simulate recording emission numbers
1. `npx hardhat record --week <number> --network mainnet` to execute recording emission numbers
1. `npx hardhat view --network hardhat` to view newly recorded emission percentages
1. `npx hardhat notify --week <number> --network hardhat` to simulate actual notification
1. `npx hardhat notify --week <number> --network mainnet` to execute actual notification
