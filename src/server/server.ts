import express, { type Express } from 'express'
import localeMiddleware from 'locale'

import { API_PREFIX } from '#routes'

import apiRouter from './api/apiRouter'
import config, { type ServerConfig } from './config'
import frontendRouter from './frontendRouter'
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

async function setupViteServer(app: Express, config: ServerConfig) {
  const vite = await import('vite')

  const viteServer = await vite.createServer({
    root: config.rootDir,
    server: { middlewareMode: true },
  })
  app.use(viteServer.middlewares)
}

async function enableApiMock() {
  if (process.env.INNODOC_API_MOCK === 'true' && process.env.INNODOC_APP_ROOT !== undefined) {
    const { makeServer } = await import('../../tests/integration/mocks/node')
    const mockServer = makeServer(process.env.INNODOC_APP_ROOT)
    mockServer.listen({ onUnhandledRequest: 'error' })
    console.log('Mock API server started...')
  }
}

async function startServer() {
  // Enable API mock
  await enableApiMock()

  const app = express()

  // Determine user locale from request headers
  app.use(localeMiddleware())

  if (config.isProduction) {
    await setupServeStatic(app, config)
  }

  await setupViteServer(app, config)

  app.use(API_PREFIX, apiRouter(config))
  app.use(frontendRouter)

  app.listen({ host: config.host, port: config.port })
  console.log(`Server running at http://${config.host}:${config.port}`)
}
