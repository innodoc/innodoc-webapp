FROM node:alpine

ARG GIT_REPO=https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp.git
ARG GIT_BRANCH=master
ENV CONTENT_ROOT
EXPOSE 8000

RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add tzdata git && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime

RUN npm install pm2 -g

WORKDIR /innodoc-webapp

RUN set -xe && \
    addgroup -S innodoc && \
    adduser -S -G innodoc innodoc && \
    chown innodoc.innodoc /innodoc-webapp

USER innodoc

RUN set -xe && \
    git clone -b ${GIT_BRANCH} --single-branch ${GIT_REPO} . && \
    git submodule init && \
    git submodule update --remote && \
    npm install && \
    cp .env.example .env && \
    npm run build

USER root

RUN set -xe && \
    apk del git tzdata && \
    rm -rf /var/cache/apk/*

USER innodoc

CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
