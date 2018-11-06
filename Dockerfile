FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add tzdata python && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

RUN npm install pm2 -g

WORKDIR /innodoc-webapp

# add user/group to run as
RUN set -xe && \
    addgroup -S innodoc && \
    adduser -S -G innodoc innodoc && \
    chown -R innodoc.innodoc /innodoc-webapp

USER innodoc

# install deps and build
COPY --chown=innodoc:innodoc \
  package.json \
  package-lock.json \
  /innodoc-webapp/
RUN npm install

# copy files/create .env
COPY --chown=innodoc:innodoc .env.example /innodoc-webapp/.env
COPY --chown=innodoc:innodoc .env.example /innodoc-webapp/
COPY --chown=innodoc:innodoc \
  .babelrc \
  next.config.js \
  jest.config.js \
  .eslintignore \
  .eslintrc.json \
  /innodoc-webapp/
COPY --chown=innodoc:innodoc e2e /innodoc-webapp/e2e/
COPY --chown=innodoc:innodoc src /innodoc-webapp/src/
COPY --chown=innodoc:innodoc server /innodoc-webapp/server/

# build app
RUN npm run build

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
