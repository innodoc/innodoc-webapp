#!/usr/bin/env node

import container from '@innodoc/container'

import setupApp from './app/setup-app.js'

const config = container.resolve('config')

try {
  const app = await setupApp()
  await app.listen({ host: config.host, port: config.port })
} catch (error) {
  console.error(error)
  process.exit(-1)
}
