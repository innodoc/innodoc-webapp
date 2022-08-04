import path from 'path'

import compression from 'compression'
import dotenv from 'dotenv'
import express, { type RequestHandler } from 'express'
import { renderPage } from 'vite-plugin-ssr'

import fetchManifest from '../utils/fetchManifest'
import { extractLocale } from '../utils/locales'

import { isErrnoException } from './types'

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const isProduction = process.env.NODE_ENV === 'production'
const rootDir = path.resolve(__dirname, '..', '..')
const distDir = path.join(rootDir, 'dist')

void startServer()

async function startServer() {
  // Fetch content locales
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }
  const { languages: locales } = await fetchManifest(contentRoot)

  const app = express()
  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default

    try {
      app.use(sirv(distDir))
    } catch (err) {
      if (isErrnoException(err) && err.code === 'ENOENT') {
        process.exit(-1)
      }
      throw err
    }
  } else {
    const vite = await import('vite')

    const viteServer = await vite.createServer({
      root: rootDir,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteServer.middlewares)
  }

  app.get('*', (async (req, res, next) => {
    const url = req.originalUrl

    // Extract locale from URL
    const { locale, urlWithoutLocale } = extractLocale(url, locales)
    const pageContextInit = { locale, url: urlWithoutLocale }

    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      return next()
    }
    const { body, statusCode, contentType } = httpResponse
    return res.status(statusCode).type(contentType).send(body)
  }) as RequestHandler) // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

  const port = parseInt(process.env.SERVER_PORT || '3000')
  const host = process.env.SERVER_HOST || 'localhost'
  app.listen({ port, host })
  console.log(`Server running at http://localhost:${port}`)
}
