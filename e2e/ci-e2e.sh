#!/usr/bin/env bash

trap killServers EXIT

killServers() {
  echo TRAP running
  if [[ $pid_content ]]; then
    echo Killing pid_content=$pid_content
    kill -INT $pid_content
  fi
  if [[ $pid_app ]]; then
    echo Killing pid_app=$pid_app
    kill -INT $pid_app
  fi
  wait
}

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7001
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content &
pid_content=$?
npm run start &
pid_app=$?

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# check for display
cmd="npm run test:e2e"
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  cmd="xvfb-run --auto-servernum $cmd"
fi

# run tests
$cmd
return_value=$?

exit $return_value
