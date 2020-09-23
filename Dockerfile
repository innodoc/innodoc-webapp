FROM ubuntu:bionic
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"
ARG BUILD_ID
ARG DEBIAN_FRONTEND=noninteractive
ARG NODE_VERSION=node_14.x
ENV NEXTJS_WEBAPP_BUILD_ID=$BUILD_ID \
    MONGOMS_DISABLE_POSTINSTALL=1 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8000
WORKDIR /home/innodocuser/innodoc-webapp

# Add user/group to run as
RUN set -xe && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      gnupg && \
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
COPY --chown=innodocuser . .
RUN set -xe && \
  ln -s .env.example .env && \
  yarn config set --home enableTelemetry 0 && \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 yarn install --immutable && \
  yarn workspace @innodoc/client-web run next telemetry disable && \
  MANIFEST_FILE=packages/client-web/e2e/content/manifest.json yarn build && \
  yarn add pm2

# Run web app
EXPOSE 8000
CMD ["yarn", "run", "pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
