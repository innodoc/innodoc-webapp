import express, { type Express } from 'express'
import localeMiddleware from 'locale'

import apiRouter from './api/apiRouter'
import frontendRouter from './frontendRouter'
import getConfig, { type ServerConfig } from './getConfig'
import { isErrnoException } from './utils'

void startServer()

async function setupServeStatic(app: Express, config: ServerConfig) {
  const sirv = (await import('sirv')).default

  try {
    app.use(sirv(config.distDir))
  } catch (err) {
    if (isErrnoException(err) && err.code === 'ENOENT') {
      console.error(`dist directory not found: ${config.distDir}`)
      console.error('Did you forget to build?')
      process.exit(-1)
    }
    throw err
  }
}

async function setupDevServer(app: Express, config: ServerConfig) {
  const vite = await import('vite')

  const viteServer = await vite.createServer({
    root: config.rootDir,
    server: { middlewareMode: true },
  })
  app.use(viteServer.middlewares)
}

async function startServer() {
  const config = await getConfig()
  const app = express()

  app.use(localeMiddleware(config.manifest.locales, config.manifest.locales[0]))

  if (config.isProduction) {
    await setupServeStatic(app, config)
  } else {
    await setupDevServer(app, config)
  }

  app.use('/api', apiRouter(config))
  app.use(frontendRouter(config))

  app.listen({ host: config.host, port: config.port })
  console.log(`Server running at http://${config.host}:${config.port}`)
}
