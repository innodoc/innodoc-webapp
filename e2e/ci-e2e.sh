#!/usr/bin/env bash

export NIGHTMARE_SHOW
export PROD_PORT=7000
export CONTENT_PORT=7001
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content &
pid_content=$!
npm run start &
pid_app=$!

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

# check $DISPLAY
cmd="npm run test:e2e"
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  cmd="xvfb-run --auto-servernum $cmd"
fi

# run tests
$cmd

# kill content server
kill -INT $(ps --ppid ${pid_content} -o pid=)
wait $pid_content

# kill app server
pid_app_babelnode=$(ps --ppid ${pid_app} -o pid=)
pid_app_babelnode_server=$(ps --ppid ${pid_app_babelnode} -o pid=)
kill -INT ${pid_app_babelnode_server}
wait $pid_app

exit $?
