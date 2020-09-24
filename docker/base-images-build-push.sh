#!/usr/bin/env bash

set -xe

REGISTRY_NAME=gitlab-registry.tubit.tu-berlin.de/innodoc/innodoc-webapp
BASE_IMAGE=${REGISTRY_NAME}/base:latest
PLAYWRIGHT_IMAGE=${REGISTRY_NAME}/playwright:latest
PLAYWRIGHT_VERSION=$(yarn workspace @innodoc/client-web node --eval "console.log(require('playwright-chromium/package.json').version)")

# Base image
docker build \
  --pull \
  --tag $BASE_IMAGE \
  --file Dockerfile.base \
  .

# Playwright image
docker build \
  --pull \
  --tag $PLAYWRIGHT_IMAGE \
  --build-arg PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION \
  --file Dockerfile.playwright \
  .

docker push $BASE_IMAGE
docker push $PLAYWRIGHT_IMAGE
