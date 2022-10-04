#!/usr/bin/env bash

set -xe

REGISTRY_URL=git.tu-berlin.de:5000
REGISTRY_NAME=${REGISTRY_URL}/innodoc/innodoc-webapp
BASE_IMAGE=${REGISTRY_NAME}/base:latest
PLAYWRIGHT_IMAGE=${REGISTRY_NAME}/playwright:latest
PLAYWRIGHT_VERSION=$(yarn workspace @innodoc/client-web node --eval "console.log(require('playwright-chromium/package.json').version)")

docker login ${REGISTRY_URL}

# Base image
docker build \
  --pull \
  --tag $BASE_IMAGE \
  --file Dockerfile.base \
  .

docker push $BASE_IMAGE

# Playwright image
docker build \
  --pull \
  --tag $PLAYWRIGHT_IMAGE \
  --build-arg PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION \
  --file Dockerfile.playwright \
  .

docker push $PLAYWRIGHT_IMAGE
