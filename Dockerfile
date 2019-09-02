# Official Alpine-based Dockerfile for innodoc-webapp
ARG BASE_IMAGE=node:alpine
FROM $BASE_IMAGE AS build
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

# build
WORKDIR /innodoc-webapp
COPY . .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# TODO: once antd-scss-theme-plugin is fixed, remove git again
RUN set -xe && \
  apk add \
    build-base \
    git \
    python2 && \
  ln -s .env.example .env && \
  yarn install --pure-lockfile && \
  yarn add --no-lockfile --ignore-workspace-root-check pm2 && \
  yarn build

FROM $BASE_IMAGE

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser

# copy app
WORKDIR /innodoc-webapp
COPY --from=build --chown=innodocuser:innodocuser /innodoc-webapp .
USER innodocuser

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["node_modules/.bin/pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
