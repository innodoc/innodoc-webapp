import path from 'path'

import compression from 'compression'
import dotenv from 'dotenv'
import express, { type RequestHandler } from 'express'
import localeMiddleware from 'locale'
import { renderPage } from 'vite-plugin-ssr'

import type { Locale } from '../types/common'
import extractLocale from '../utils/extractLocale'
import fetchManifest from '../utils/fetchManifest'

import { isErrnoException } from './utils'

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const isProduction = process.env.NODE_ENV === 'production'
const rootDir = path.resolve(__dirname, '..', '..')
const distDir = path.join(rootDir, 'dist')

void startServer()

async function startServer() {
  // Fetch manifest
  const { languages: locales } = await fetchManifest()

  const app = express()
  app.use(compression())
  app.use(localeMiddleware(locales, locales[0]))

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
      server: { middlewareMode: true },
    })
    app.use(viteServer.middlewares)
  }

  app.get('*', (async (req, res, next) => {
    const url = req.originalUrl

    // Extract locale from URL, fallback to browser Accept-Language
    const { locale, urlWithoutLocale } = extractLocale(url, locales, req.locale)
    const pageContextInit: PageContextInit = {
      locale,
      urlOriginal: urlWithoutLocale,
    }

    // Ensure url path is prefixed with locale
    if (url.split('/')[1] !== locale) {
      const redirectUrl = url.length > 1 ? `/${locale}${url}` : `/${locale}`
      return res.redirect(307, redirectUrl)
    }

    // Render page
    const pageContext = await renderPage(pageContextInit)

    // Honor redirection directive from app
    if (pageContext.redirectTo !== undefined) {
      return res.redirect(307, pageContext.redirectTo)
    }

    if (!pageContext.httpResponse) {
      return next()
    }

    const { body, statusCode, contentType } = pageContext.httpResponse
    return res.status(statusCode).type(contentType).send(body)
  }) as RequestHandler) // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

  const port = parseInt(process.env.SERVER_PORT || '3000')
  const host = process.env.SERVER_HOST || 'localhost'
  app.listen({ port, host })
  console.log(`Server running at http://${host}:${port}`)
}

type PageContextInit = {
  locale: Locale
  urlOriginal: string
  redirectTo?: string
}
