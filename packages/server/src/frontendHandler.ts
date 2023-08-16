import { renderPage } from 'vite-plugin-ssr/server'
import type { LanguageCode } from 'iso-639-1'

import type { PageContextInit, PageContextServer } from '#types'

import { asyncWrapper } from './utils'

const frontendHandler = asyncWrapper(async (req, res) => {
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
    throw pageContext.errorWhileRendering
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
})

export default frontendHandler
