# Based on https://github.com/microsoft/playwright/blob/master/docs/docker/Dockerfile.bionic

ARG BUILD_IMAGE=innodoc/innodoc-webapp
FROM $BUILD_IMAGE AS build

FROM ubuntu:bionic
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

ARG BUILD_ID
ARG DEBIAN_FRONTEND=noninteractive
ARG NODE_VERSION=node_14.x
ENV INNODOC_WEBAPP_CI=true \
    NEXTJS_WEBAPP_BUILD_ID=$BUILD_ID \
    MONGOMS_DISABLE_POSTINSTALL=1 \
    PLAYWRIGHT_BROWSERS_PATH=/home/innodocuser/innodoc-webapp/.yarn/pw-browsers
WORKDIR /home/innodocuser/innodoc-webapp

RUN set -xe && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      dumb-init \
      gnupg \
      fonts-noto-color-emoji \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libdrm2 \
      libgbm1 \
      libgdk-pixbuf2.0-0 \
      libgtk-3-0 \
      libnss3 \
      libx11-xcb1 \
      libxcb-dri3-0 \
      libxss1 \
      libxtst6 && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://deb.nodesource.com/$NODE_VERSION bionic main" > /etc/apt/sources.list.d/nodesource.list && \
    echo "deb-src https://deb.nodesource.com/$NODE_VERSION bionic main" >> /etc/apt/sources.list.d/nodesource.list && \
    cat /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    useradd --shell /bin/bash innodocuser && \
    chown -R innodocuser /home/innodocuser && \
    apt-get remove --auto-remove --purge -y curl gnupg && \
    rm -rf /var/lib/apt/lists/*

USER innodocuser
COPY --from=build --chown=innodocuser /home/innodocuser/innodoc-webapp .

# Force Chromium download
RUN set -xe && \
    cd .yarn/unplugged/playwright-chromium*/node_modules/playwright-chromium && \
    yarn run install

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "run", "test:e2e", "--color"]
