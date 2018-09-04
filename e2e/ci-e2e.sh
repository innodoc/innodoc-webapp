#!/usr/bin/env bash

trap "kill 0" EXIT
set -e

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7002
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

npm run test:e2e:content >/dev/null &
npm run start >/dev/null &

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# Xvfb -ac -screen scrn 1280x2000x24 :99.0 &
# export DISPLAY=:99.0
xvfb-run --server-args="-screen 0 1024x768x24" npm run test:e2e
