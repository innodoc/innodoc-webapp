This directory contains base Dockerfiles. This greatly speed-ups the CI
pipelines. The images should be build and pushed with every new Playwright
version.

- `Dockerfile.base` &ndash; `innodoc/innodoc-webapp/base`
  - Based on `ubuntu/bionic`
  - Node.js + Yarn
  - `innodocuser` account
- `Dockerfile.playwright` &ndash; `innodoc/innodoc-webapp/playwright`
  - Based on `innodoc/innodoc-webapp/base`
  - Chromium dependencies
  - Playwright-bundled Chromium version baked in  
    (`/home/innodocuser/.cache/ms-playwright`)
