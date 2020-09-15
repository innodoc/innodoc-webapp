# Official Alpine-based Dockerfile for innodoc-webapp
ARG BASE_IMAGE=node:14-alpine3.12
FROM $BASE_IMAGE AS build
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"
ARG BUILD_ID
ENV NEXTJS_WEBAPP_BUILD_ID=$BUILD_ID \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    MONGOMS_DISABLE_POSTINSTALL=1 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8000

# Build
WORKDIR /innodoc-webapp
RUN set -xe && \
  apk add --no-cache \
    build-base \
    git \
    python3
COPY . .
RUN set -xe && \
  ln -s .env.example .env && \
  yarn install --immutable && \
  yarn workspace @innodoc/client-web run next telemetry disable && \
  MANIFEST_FILE=packages/client-web/e2e/content/manifest.json yarn build

FROM $BASE_IMAGE

# Add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser

# Copy app
WORKDIR /innodoc-webapp
COPY --from=build --chown=innodocuser:innodocuser /innodoc-webapp .
USER innodocuser
RUN set -xe && yarn add pm2

# Run web app
EXPOSE 8000
CMD ["yarn", "run", "pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
