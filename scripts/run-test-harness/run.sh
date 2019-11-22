#!/usr/bin/env bash
tap "$@" --reporter=base --debug --node-arg="-r" --node-arg="@scripts/run-test-harness" --no-esm --no-ts test/**/*.test.js