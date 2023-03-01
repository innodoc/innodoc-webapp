import { type RequestHandler } from 'express'
import type { LanguageCode } from 'iso-639-1'
import { renderPage } from 'vite-plugin-ssr'

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
    return res.redirect(307, pageContext.redirectTo)
  }
  // Check response
  else if (pageContext.httpResponse === null) {
    next(new Error(`${req.originalUrl}: renderPage() didn't return httpResponse`))
  }
  // Send result
  else {
    const { body, statusCode, contentType } = pageContext.httpResponse
    res.status(statusCode).type(contentType).send(body)
  }
}) as RequestHandler // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

export default frontendHandler
