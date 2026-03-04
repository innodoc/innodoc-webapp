#!/usr/bin/env node

import parseConfig from '@innodoc/server-env'

import setupApp from './app/setup-app.js'

try {
  const config = parseConfig()
  const app = await setupApp(config)
  await app.listen({ host: config.host, port: config.port })
} catch (error) {
  console.error(error)
  process.exit(-1)
}
