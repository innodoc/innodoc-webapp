FROM node:10-alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

RUN set -xe && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

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

USER root
RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add \
      bash \
      coreutils \
      netcat-openbsd \
      lsof \
      gtk+2.0 \
      libxtst \
      libxscrnsaver \
      gconf \
      nss \
      alsa-lib \
      xvfb && \
    rm -rf /var/cache/apk/*

# RUN set -xe && \
#     apt-get update && \
#     apt-get install -y \
#       netcat \
#       lsof \
#       xvfb \
#       libgtk2.0-0 \
#       libx11-xcb1 \
#       libxtst6 \
#       libxss1 \
#       libgconf-2-4 \
#       libnss3 \
#       libasound2 && \
#     rm -rf /var/lib/apt/lists/*

# USER innodoc
# run web app
CMD ["npm", "run", "test:e2e:ci"]
