# Official Alpine-based Dockerfile for innodoc-webapp

FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

WORKDIR /innodoc-webapp

# no need to bundle full-fledged chomium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install pm2 -g && npm cache clear --force

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser && \
    chown -R innodocuser.innodocuser /innodoc-webapp

USER innodocuser

# install npm packages
COPY --chown=innodocuser:innodocuser \
  package.json \
  package-lock.json \
  /innodoc-webapp/
RUN npm install && rm -rf /home/innodocuser/.npm

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

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
