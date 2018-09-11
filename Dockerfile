FROM node:alpine

RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime

RUN npm install pm2 -g

WORKDIR /innodoc-webapp
COPY . /innodoc-webapp

# add user/group to run as
RUN set -xe && \
    addgroup -S innodoc && \
    adduser -S -G innodoc innodoc && \
    chown -R innodoc.innodoc /innodoc-webapp

# install deps
USER innodoc
RUN set -xe && \
    npm install

# build app
RUN set -xe && \
    cp .env.example .env && \
    npm run build

# clean up
USER root
RUN set -xe && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

# run web app
USER innodoc
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
