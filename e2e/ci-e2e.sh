#!/usr/bin/env bash

trap "kill 0" EXIT
set -e

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7002
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content >/dev/null &
npm run start >/dev/null &

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# e2e test command
cmd="npm run test:e2e"

# check for display
if [[ $DISPLAY ]]; then
  $cmd
else
  echo "Running in headless mode (using Xvfb)"
  # headless mode (CI)
  xvfb-run --server-args="-screen 0 1024x768x24" $cmd
fi
