#!/bin/bash

while true ; do
  echo "#################################################################################################################"
  HARDHAT_NETWORK=hardhat node standalone-runner.js
  sleep 10
  HARDHAT_NETWORK=cron_mainnet node standalone-runner.js
  sleep 30
done