FROM gitlab-registry.tubit.tu-berlin.de/innodoc/innodoc-webapp/base:latest
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"
ARG BUILD_ID
ENV NEXTJS_WEBAPP_BUILD_ID=$BUILD_ID \
    MONGOMS_DISABLE_POSTINSTALL=1 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8000

USER innodocuser
COPY --chown=innodocuser . /home/innodocuser/innodoc-webapp
WORKDIR /home/innodocuser/innodoc-webapp
RUN set -xe && \
  ln -s .env.example .env && \
  yarn config set --home enableTelemetry 0 && \
  yarn install --immutable && \
  yarn workspace @innodoc/client-web run next telemetry disable && \
  MANIFEST_FILE=packages/client-web/e2e/content/manifest.json yarn build

EXPOSE 8000
CMD ["yarn", "run", "pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
