# Dockerfiles innodoc-webapp

This directory contains the project's Dockerfiles.

## Images

- `Dockerfile`
  - Based on `innodoc/innodoc-webapp/base`
  - Includes the innodoc web application
- `Dockerfile.e2e`
  - Based on `innodoc/innodoc-webapp/playwright`
  - Includes a custom innodoc-webapp build (via `$BUILD_IMAGE`)
  - Runs E2E tests

## Base images

Using base images greatly improves CI build times. The image
`innodoc/innodoc-webapp/playwright` must be rebuilt and pushed with every new
Playwright version!

- `Dockerfile.base` &ndash; `innodoc/innodoc-webapp/base`
  - Based on `ubuntu/bionic`
  - Node.js + Yarn
  - `innodocuser` account
- `Dockerfile.playwright` &ndash; `innodoc/innodoc-webapp/playwright`
  - Based on `innodoc/innodoc-webapp/base`
  - Chromium dependencies
  - Playwright-bundled Chromium version baked in  
    (`/home/innodocuser/.cache/ms-playwright`)
