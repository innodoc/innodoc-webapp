import path from 'node:path'

import autoLoad from '@fastify/autoload'
import fastify from 'fastify'

import type { ConfigSchema } from '@innodoc/shared-core/types'

import diContainerPlugin from '#plugins/di-container'
import { getRootDirPath } from '#utils'

async function setupApp(config: ConfigSchema) {
  // Env plugin
  const envPlugin = await (config.isProduction ? import('./prod.js') : import('./dev.js'))

  // Instantiate Fastify app
  const app = fastify(await envPlugin.options())

  // Register DI container
  await app.register(diContainerPlugin, { config })

  // Register environment plugin
  await app.register(envPlugin.default)

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
