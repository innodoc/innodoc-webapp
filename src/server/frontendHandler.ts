import { type RequestHandler } from 'express'
import type { LanguageCode } from 'iso-639-1'
import { renderPage } from 'vite-plugin-ssr/server'

import type { PageContextInit, PageContextServer } from '#types/pageContext'

const frontendHandler = (async (req, res, next) => {
  const locale = req.rawLocale.language as LanguageCode

  // Create page context
  const pageContextInit: PageContextInit = {
    requestLocale: locale,
    urlOriginal: req.originalUrl,
    host: req.headers.host,
  }

  // Render page
  const pageContext = await renderPage<PageContextServer, PageContextInit>(pageContextInit)

  // Check error
  if (pageContext.errorWhileRendering) {
    next(pageContext.errorWhileRendering)
  }

  // Follow redirection directive from app
  else if (pageContext.redirectTo !== undefined) {
    res.redirect(307, pageContext.redirectTo)
  }

  // Send result
  else if (pageContext.httpResponse !== null) {
    const { body, statusCode, contentType } = pageContext.httpResponse
    res.status(statusCode).type(contentType).send(body)
  }

  // Otherwise send 404
  else {
    res.status(404).send('404 Not found')
  }
}) as RequestHandler // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

export default frontendHandler
