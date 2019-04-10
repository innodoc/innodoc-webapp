# Official Alpine-based Dockerfile for innodoc-webapp
FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

WORKDIR /innodoc-webapp

# install pm2
RUN yarn global add pm2 && yarn cache clean

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser && \
    chown -R innodocuser.innodocuser .

USER innodocuser

# install packages
COPY --chown=innodocuser:innodocuser \
  package.json \
  yarn.lock \
  ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN yarn install --pure-lockfile && yarn cache clean

# copy files
COPY --chown=innodocuser:innodocuser . .

# create .env
RUN ln -s .env.example .env

# build app
RUN yarn build

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "yarn", "--interpreter", "/bin/sh", "--name", "innodoc-webapp", "--", "start"]
