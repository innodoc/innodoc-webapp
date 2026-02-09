#!/usr/bin/env node

import config from '@innodoc/config'

import setupApp from './app/setupApp.js'

try {
  const app = await setupApp()
  await app.listen({ host: config.host, port: config.port })
} catch (error) {
  console.error(error)
  process.exit(-1)
}
