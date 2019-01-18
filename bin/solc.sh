#!/usr/bin/env bash

ROOT=$(realpath $(dirname $(dirname "$0")))
SRC="$ROOT/contracts"
DST="$ROOT/out"
mkdir -p "$DST"

solc --bin --abi --optimize --optimize-runs 200 --overwrite -o "$DST" "$SRC"/*.sol
