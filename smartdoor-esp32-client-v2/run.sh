#!/bin/bash

set -o allexport
source .env
set +o allexport

echo "BASE_API_URL: $BASE_API_URL"
echo "WIFI_SSID: $WIFI_SSID"
echo "WIFI_PASS: $WIFI_PASS"
echo "DEVICE_ID: $DEVICE_ID"
echo "HMAC_SECRET_KEY": "${HMAC_SECRET_KEY}"

pio run --target upload

while IFS='=' read -r key _; do
    unset "$key"
done < .env