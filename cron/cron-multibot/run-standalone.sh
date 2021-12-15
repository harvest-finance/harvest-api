#!/bin/bash

while true ; do
  HARDHAT_NETWORK=cron_mainnet node standalone-runner.js
  echo "======================Restarting in 10m..."
  sleep 600
done
