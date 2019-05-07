# Official Alpine-based Dockerfile for innodoc-webapp
ARG BUILD_IMAGE=node:alpine
FROM $BUILD_IMAGE AS build
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

# build
WORKDIR /innodoc-webapp
COPY . .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN set -xe && \
  apk add \
    build-base \
    python2 && \
  ln -s .env.example .env && \
  yarn install --pure-lockfile && \
  yarn build

FROM $BUILD_IMAGE

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser

# copy app
WORKDIR /innodoc-webapp
COPY --from=build --chown=innodocuser:innodocuser /innodoc-webapp .
USER innodocuser
RUN set -xe && \
  yarn global add pm2 && \
  yarn cache clean

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
