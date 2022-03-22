# Emissions tools (Ethereum Mainnet)

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
1. Edit `../data/ethereum.csv` with latest percentages
1. `npx hardhat record --network mainnet` to record emission percentages
1. `npx hardhat execute --network mainnet --debug false` to execute the emissions
1. `npx hardhat execute --network hardhat --debug true` to simulate the execution

## Admin-only methods:

1. `npx hardhat append-mints` - appends multiple mints for future execution by `execute-mint`
1. `npx hardhat execute-fist-mint` - to execute first mint

## Other methods:
1. `npx hardhat incentivize-ifarm-pool` - incentivizes a specific iFARM pool with a given amount of FARM
1. `npx hardhat execute-mint --week 70 --network hardhat --debug true` to simulate actual minting and notification
1. `npx hardhat execute-mint --week 70 --network mainnet --debug false` to execute actual minting and notification
1. `npx hardhat record --network hardhat` to simulate recording emission percentages
1. `npx hardhat view --network hardhat` to view newly recorded emission percentages
