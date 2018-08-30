FROM node:alpine

ARG GIT_REPO=https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp.git
ARG CONTENT_ROOT

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
    git clone ${GIT_REPO} . && \
    git submodule init && \
    git submodule update --remote && \
    npm install && \
    cat .env.example | sed '/CONTENT_ROOT=/c\CONTENT_ROOT='${CONTENT_ROOT} > .env && \
    npm run build

USER root

RUN set -xe && \
    apk del git tzdata && \
    rm -rf /var/cache/apk/*

EXPOSE 8000

USER innodoc

CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
