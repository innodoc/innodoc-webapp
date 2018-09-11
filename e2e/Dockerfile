ARG image=gitlab-registry.tubit.tu-berlin.de/innodoc/innodoc-webapp:latest
FROM $image
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"

USER root
RUN set -xe && \
    apk update && \
    apk upgrade && \
    apk add \
      bash \
      netcat-openbsd \
      lsof \
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

USER innodoc
WORKDIR /innodoc-webapp
CMD ["npm", "run", "test:e2e:ci"]
