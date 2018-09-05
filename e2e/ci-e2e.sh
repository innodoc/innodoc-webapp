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
  cmd="xvfb-run --auto-servernum $cmd"
fi

# run tests
$cmd

echo killing content server
kill -INT $(lsof -ti tcp:${CONTENT_PORT})
wait $pid_content
echo content server killed

echo killing app server
kill -INT $(lsof -ti tcp:${PROD_PORT})
wait $pid_app
echo app server killed

exit $?
