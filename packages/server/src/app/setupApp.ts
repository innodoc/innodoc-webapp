import path from 'node:path'

import autoLoad from '@fastify/autoload'
import type { FastifyInstance } from 'fastify'

import config from '@innodoc/config'

import { getServerPath } from '#utils'

const srcPath = path.join(getServerPath(), 'src')

async function makeApp(): Promise<FastifyInstance> {
  return config.isProduction
    ? (await import('./makeAppProd.js')).default()
    : (await import('./makeAppDev.js')).default()
}

async function setupApp() {
  const app = await makeApp()

  // register services
  await app.register(autoLoad, {
    dir: path.join(srcPath, 'services'),
    dirNameRoutePrefix: false,
    forceESM: true,
    // auto-load files: `MODULE/MODULE.ts`
    matchFilter: (path) => Boolean(path.match(/^\/(\w+)\/\1\.ts$/)),
  })

  return app
}

export default setupApp
