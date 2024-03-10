import path from 'node:path'

import autoLoad from '@fastify/autoload'
import fastify from 'fastify'

import config from '@innodoc/config'

import { getServerPath } from '#utils'

const srcPath = path.join(getServerPath(), 'src')

async function setupApp() {
  // Initialize fastify in env
  const env = await (config.isProduction ? import('./prod.js') : import('./dev.js'))
  const app = fastify(await env.options())
  await app.register(env.default)

  // Register services
  await app.register(autoLoad, {
    dir: path.join(srcPath, 'services'),
    dirNameRoutePrefix: false,
    forceESM: true,
    // auto-load files: `MODULE/MODULE.ts`
    matchFilter: (path) => Boolean(/^\/(\w+)\/\1\.ts$/.test(path)),
  })

  return app
}

export default setupApp
