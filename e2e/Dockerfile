FROM node:latest

ENV DEBIAN_FRONTEND=noninteractive

CMD set -xe && \
    apt-get update && \
    apt-get install -y \
      netcat \
      lsof \
      xvfb \
      libgtk2.0-0 \
      libx11-xcb1 \
      libxtst6 \
      libxss1 \
      libgconf-2-4 \
      libnss3 \
      libasound2 && \
    rm -rf /var/lib/apt/lists/*
