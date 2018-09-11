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
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  export DISPLAY=:99
  Xvfb $DISPLAY &
  pid_xvfb=$!
fi

# run tests
npm run test:e2e
ret_value=$?

# kill processes
kill -INT $(lsof -ti tcp:${CONTENT_PORT})
wait $pid_content
kill -INT $(lsof -ti tcp:${PROD_PORT})
wait $pid_app
if [[ $pid_xvfb ]]; then
  kill -INT $pid_xvfb
  wait $pid_app
fi

exit $ret_value
