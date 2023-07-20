import path from 'path'

import express, { type Express } from 'express'
import localeMiddleware from 'locale'

import { API_PREFIX } from '@innodoc/constants'

import apiRouter from './api/apiRouter'
import config from './config'
import frontendHandler from './frontendHandler'
import { isErrnoException } from './utils'

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
    root: path.join(config.rootDir, 'packages', 'app'),
    server: { middlewareMode: true },
  })
  app.use(viteDevMiddleware.middlewares)
}

async function createServer() {
  const app = express()

  app.use(localeMiddleware())

  if (config.isProduction) {
    // Serve static assets in production
    await setupServeStatic(app)
  } else {
    // Spin up Vite dev server
    await setupViteDevServer(app)
  }

  // Enable API
  if (!config.enableMockApi) {
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

  return app
}

export default createServer
