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

# check for display
cmd="npm run test:e2e"
if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xvfb)"
  cmd="xvfb-run --auto-servernum $cmd"
fi

# run tests
$cmd

echo Wait for content server
kill -TERM $(ps --ppid ${pid_content} -o pid=)
wait $pid_content >/dev/null
echo Killed content server

echo Wait for app server
pid_app_babelnode=$(ps --ppid ${pid_app} -o pid=)
pid_app_babelnode_server=$(ps --ppid ${pid_app_babelnode} -o pid=)
echo killing PID ${pid_app_babelnode_server}
kill -TERM ${pid_app_babelnode_server}
wait $pid_app >/dev/null
echo Killed app server

exit $?
