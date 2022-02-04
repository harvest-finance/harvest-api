# Hardhat Cronjob bot
1. set up `settings.json` and `dev-keys.json`
1. `bash run-standalone.sh`

## `settings.json`
```
{
  "gasPriceMax": "901000000000",
  "priorityFeeMax": "50000000000",
  "gasLimit": "3500000",
  "prometheusMonitoring" : {
    "enabled": false,
    "pushGatewayUrl": "http://127.0.0.1:9091"
  },
  "owlracleApiKey": "<your key>"
}
```
## `dev-keys.json`
```
{
  "alchemyKey": "<your key>"
}
```
