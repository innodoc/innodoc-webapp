ARG BUILD_IMAGE=innodoc/innodoc-webapp
FROM $BUILD_IMAGE
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

ENV INNODOC_WEBAPP_CI=true \
    PLAYWRIGHT_BROWSERS_PATH=/home/innodocuser/innodoc-webapp/.yarn/pw-browsers
WORKDIR /home/innodocuser/innodoc-webapp

USER root
RUN set -xe && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      dumb-init \
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
    rm -rf /var/lib/apt/lists/*

USER innodocuser

# Copy CI cached browser and trigger (potential) download
COPY .yarn/pw-browsers .yarn
RUN set -xe && \
    yarn config set --home enableTelemetry 0 && \
    yarn workspace @innodoc/client-web run next telemetry disable && \
    cd .yarn/unplugged/playwright-chromium*/node_modules/playwright-chromium && \
    yarn run install

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "run", "test:e2e", "--color"]
