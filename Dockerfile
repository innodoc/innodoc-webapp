FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add --no-cache \
      tzdata \
      python \
      make \
      g++ && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    apk del tzdata && \
    rm -rf \
      /usr/include \
      /var/cache/apk/* \
      /usr/share/man \
      /tmp/*

RUN npm install pm2 -g

WORKDIR /innodoc-webapp

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser && \
    chown -R innodocuser.innodocuser /innodoc-webapp

USER innodocuser

# install deps and build
COPY --chown=innodocuser:innodocuser \
  package.json \
  package-lock.json \
  /innodoc-webapp/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install

# copy files/create .env
COPY --chown=innodocuser:innodocuser .env.example /innodoc-webapp/.env
COPY --chown=innodocuser:innodocuser \
  .env.example \
  .babelrc \
  next.config.js \
  jest.config.js \
  jest-puppeteer.config.js \
  enzyme.config.js \
  .eslintignore \
  .eslintrc.json \
  /innodoc-webapp/
COPY --chown=innodocuser:innodocuser e2e /innodoc-webapp/e2e/
COPY --chown=innodocuser:innodocuser src /innodoc-webapp/src/
COPY --chown=innodocuser:innodocuser server /innodoc-webapp/server/

# build app
RUN npm run build

# cleanup
RUN rm -rf /home/innodocuser/.npm

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
