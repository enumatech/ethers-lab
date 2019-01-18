#!/usr/bin/env bash

APIS="personal,net,eth,web3"

set -x

geth \
    --dev \
    --verbosity 3 \
    --nousb --nodiscover --nat none \
    --rpcaddr 0.0.0.0 --rpccorsdomain '*' --rpcvhosts '*' --rpcapi "$APIS" \
    "$@"
