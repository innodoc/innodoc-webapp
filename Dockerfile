# Official Alpine-based Dockerfile for innodoc-webapp
ARG BASE_IMAGE=node:14-alpine3.12
FROM $BASE_IMAGE AS build
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"
ARG BUILD_ID
ENV NEXTJS_WEBAPP_BUILD_ID=$BUILD_ID

# build
WORKDIR /innodoc-webapp
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN set -xe && \
  apk add --no-cache \
    build-base \
    git \
    python
COPY . .
RUN set -xe && \
  ln -s .env.example .env && \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 MONGOMS_DISABLE_POSTINSTALL=1 yarn install --freeze-lockfile && \
  yarn add --no-lockfile --ignore-workspace-root-check pm2 && \
  npx next telemetry disable && \
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
ENV APP_PORT=8000
CMD ["node_modules/.bin/pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
