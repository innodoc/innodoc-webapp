#!/usr/bin/env bash

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7001
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content 2>&1 >/dev/null &
pid_content=$!
npm run start 2>&1 >/dev/null &
pid_app=$!

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# check for DISPLAY
cmd="npm run test:e2e"
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  cmd="xvfb-run --auto-servernum --server-args='-screen 0 1280x1024x24 -dpi 100 -ac' $cmd"
fi

# run tests
$cmd
ret_value=$?

# kill app and content server
kill -INT $(lsof -ti tcp:${CONTENT_PORT})
wait $pid_content
kill -INT $(lsof -ti tcp:${PROD_PORT})
wait $pid_app

exit $ret_value
