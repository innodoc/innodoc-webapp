#!/usr/bin/env bash

function finish {
  trap '' INT TERM # ignore INT and TERM while shutting down
  kill -TERM 0 # kill process group
  wait
}
trap finish EXIT

export NIGHTMARE_SHOW
export PROD_PORT=7001
export CONTENT_PORT=7002
export CONTENT_ROOT="http://localhost:${CONTENT_PORT}/"

# start app and content server
npm run test:e2e:content &
pid_content=$!
npm run start &
pid_app=$!

# wait for app and content server
while ! nc -z localhost $CONTENT_PORT; do sleep 0.1; done
while ! nc -z localhost $PROD_PORT; do sleep 0.1; done

if [[ ! $DISPLAY ]]; then
  echo "Running in headless mode (using Xdummy)"
  /usr/bin/Xorg -noreset +extension GLX +extension RANDR +extension RENDER -config ${PWD}/e2e/xorg-dummy.conf :99 &
  pid_xorg=$!
  export DISPLAY=:99
fi


npm run test:e2e
exit $?
