import { type RequestHandler } from 'express'
import type { LanguageCode } from 'iso-639-1'
import { renderPage } from 'vite-plugin-ssr'

const frontendHandler = (async (req, res, next) => {
  const locale = req.rawLocale.language as LanguageCode

  // Create page context
  const pageContextInit: PageContextInit = {
    requestLocale: locale,
    urlOriginal: req.originalUrl,
    host: req.headers.host,
  }

  // Render page
  const pageContext = await renderPage(pageContextInit)

  // Follow redirection directive from app
  if (pageContext.redirectTo !== undefined) return res.redirect(307, pageContext.redirectTo)

  if (!pageContext.httpResponse)
    return next(new Error(`${req.originalUrl}: renderPage() didn't return httpResponse`))

  const { body, statusCode, contentType } = pageContext.httpResponse
  return res.status(statusCode).type(contentType).send(body)
}) as RequestHandler // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

export interface PageContextInit {
  requestLocale: LanguageCode
  urlOriginal: string
  host?: string
}

export default frontendHandler
