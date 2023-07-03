import express, { type Express } from 'express'
import localeMiddleware from 'locale'

import { API_PREFIX } from '#constants'

import apiRouter from './api/apiRouter'
import config from './config'
import frontendHandler from './frontendHandler'
import { isErrnoException } from './utils'

void startServer()

async function setupServeStatic(app: Express) {
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

async function setupViteDevServer(app: Express) {
  const vite = await import('vite')

  const viteDevMiddleware = await vite.createServer({
    root: config.rootDir,
    server: { middlewareMode: true },
  })
  app.use(viteDevMiddleware.middlewares)
}

async function enableApiMock() {
  const { makeServer } = await import('../../tests/mocks/node')
  const mockServer = makeServer(config.appRoot)
  mockServer.listen({ onUnhandledRequest: 'error' })
  console.log('Mock API server started...')
}

async function startServer() {
  const app = express()

  app.use(localeMiddleware())
  if (config.isProduction) {
    await setupServeStatic(app)
  } else {
    await setupViteDevServer(app)
  }

  // Enable API
  if (config.enableMockApi) {
    await enableApiMock()
  } else {
    app.use(API_PREFIX, apiRouter)
  }

  // Serve frontend
  if (!config.isProduction) {
    apiRouter.use((req, res, next) => {
      console.log(`Frontend request: ${req.url}`)
      next()
    })
  }
  app.use(frontendHandler)

  // TODO: Add error handler

  app.listen({ host: config.host, port: config.port })
  console.log(`Server running at http://${config.host}:${config.port}`)
}
