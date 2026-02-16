#!/usr/bin/env node

import setupApp from './app/setup-app.js'
import container from './container'

const config = container.resolve('config')

try {
  const app = await setupApp()
  await app.listen({ host: config.host, port: config.port })
} catch (error) {
  console.error(error)
  process.exit(-1)
}
