#!/usr/bin/env node

import parseConfig from '@innodoc/server-env'
import setupServer from './server.js'

try {
  const config = parseConfig()
  const server = await setupServer(config)
  server.listen({ host: config.host, port: config.port }, (err, address) => {
    if (err) {
      throw err
    }
    console.log(`Listening ${address}`)
  })
} catch (error) {
  console.error(error)
  process.exit(-1)
}
