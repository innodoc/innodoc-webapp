#!/usr/bin/env bash

function killServers {
  echo Killing app and content server
  if [[ $pid_content ]]; then
    echo Killing content server
    kill -TERM $pid_content
  fi
  if [[ $pid_app ]]; then
    echo Killing app server
    kill -TERM $pid_app
  fi
}
trap killServers EXIT

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
if [[ $DISPLAY ]]; then
  npm run test:e2e
  return_value=$?
else
  echo "Running in headless mode (using Xvfb)"
  xvfb-run --auto-servernum -e /dev/stdout npm run test:e2e
  return_value=$?
fi

echo "E2E tests finished, result=${return_value}"
exit $return_value
