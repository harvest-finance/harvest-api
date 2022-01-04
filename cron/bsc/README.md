# Hardhat Cronjob bot
1. set up `settings.json` and `dev-keys.json`
1. `bash run-standalone.sh`

## `settings.json`
```
{
  "gasPriceMax": "201000000000",
  "gasLimit": "3000000",
  "prometheusMonitoring" : {
    "enabled": false,
    "pushGatewayUrl": "http://127.0.0.1:9091"
  }
}
```
## `dev-keys.json`
```
{
  "getBlockKey": "<your key>"
}
```