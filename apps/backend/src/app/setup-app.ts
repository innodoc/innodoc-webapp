import path from 'node:path'

import autoLoad from '@fastify/autoload'
import fastify from 'fastify'

import type { ConfigSchema } from '@innodoc/shared-core/types'

import diContainerPlugin from '#plugins/di-container'
import { getRootDirPath } from '#utils'

async function setupApp(config: ConfigSchema) {
  // Initialize fastify in env
  const env = await (config.isProduction ? import('./prod.js') : import('./dev.js'))
  const app = fastify(await env.options())
  await app.register(env.default)

  // Register DI container
  await app.register(diContainerPlugin, { config })

  // Register services
  await app.register(autoLoad, {
    dir: path.join(getRootDirPath(), 'services'),
    dirNameRoutePrefix: false,
    forceESM: true,
    // auto-load files: `MODULE/MODULE.ts`
    matchFilter: (path) => /^\/(\w+)\/\1\.js$/.test(path),
  })

  return app
}

export default setupApp
