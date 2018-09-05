#!/usr/bin/env bash

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
  cmd="xvfb-run --auto-servernum -e /dev/stdout $cmd"
fi

# run tests
$cmd
return_value=$?

# kill app and content servers
# Note: We could use trap function to kill server processes but this proved
# to be problematic with GitLab CI as return value was never passed through
# correctly.
kill -INT $pid_content && echo Killed content server
kill -INT $pid_app && echo Killed app server
wait

exit $return_value
