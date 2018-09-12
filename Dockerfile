FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add tzdata && \
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

# create .env
COPY --chown=innodoc:innodoc \
  .env.example \
  /innodoc-webapp/.env

# build
COPY --chown=innodoc:innodoc \
  e2e \
  src \
  server \
  .babelrc \
  next.config.js \
  jest.config.js \
  .eslintignore \
  /innodoc-webapp/
RUN npm run build

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
