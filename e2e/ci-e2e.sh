#!/usr/bin/env bash

trap "kill 0" EXIT
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"
export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7002
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

cd ${SCRIPT_DIR}/..
npm run test:e2e:content >/dev/null &
npm run start >/dev/null &

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

npm run test:e2e
