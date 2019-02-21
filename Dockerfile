# Official Alpine-based Dockerfile for innodoc-webapp
FROM node:alpine
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

WORKDIR /innodoc-webapp

# install pm2
RUN npm install pm2 -g && rm -rf /root/.npm /tmp/npm-*

# add user/group to run as
RUN set -xe && \
    addgroup -S innodocuser && \
    adduser -S -g innodocuser innodocuser && \
    chown -R innodocuser.innodocuser .

USER innodocuser

# install npm packages
COPY --chown=innodocuser:innodocuser \
  package.json \
  package-lock.json \
  ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install && rm -rf /home/innodocuser/.npm /tmp/npm-*

# copy files
COPY --chown=innodocuser:innodocuser . .

# create .env
RUN ln -s .env.example .env

# build app
RUN npm run build

# run web app
EXPOSE 8000
ENV CONTENT_ROOT=http://localhost:8001/
CMD ["pm2-runtime", "start", "npm", "--name", "innodoc-webapp", "--", "start"]
