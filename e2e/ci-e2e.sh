#!/usr/bin/env bash

function finish {
  trap '' INT TERM # ignore INT and TERM while shutting down
  kill -TERM 0 # kill process group
  wait
}
trap finish EXIT

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7001
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content >/dev/null &
npm run start >/dev/null &

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# check for display
cmd="npm run test:e2e"
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  cmd="xvfb-run --server-args=\"-screen 0 1920x1080x24\" $cmd"
fi

$cmd
exit $?
