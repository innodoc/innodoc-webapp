import { isNativeError } from 'node:util/types'

import { renderPage } from 'vike/server'
import type { RouteHandlerMethod } from 'fastify'

/**
 * Handle app frontend request.
 *
 * Create an initial `PageContext` and pass it to vike to render the page.
 *
 * @param req Incoming request
 * @param reply HTTP response
 * @returns HTTP response
 */
const frontendHandler: RouteHandlerMethod = async (req, reply) => {
  const locales = req.languages().filter((locale) => locale !== '*')

  // Create page context
  const pageContextInit = {
    host: req.headers.host,
    requestLocales: locales,
    urlOriginal: req.originalUrl,
  }

  // Render page
  const pageContext = await renderPage(pageContextInit)

  // Don't throw if there is a pageContext.httpResponse, otherwise
  // the error page won't be rendered.
  if (!pageContext.httpResponse && isNativeError(pageContext.errorWhileRendering)) {
    throw pageContext.errorWhileRendering
  }

  // pageContext.httpResponse is missing if:
  //  - There is an error, but no error page.
  //  - Error page has a bug and couldn't be rendered.
  if (!pageContext.httpResponse) {
    reply.callNotFound()
    return
  }

  // Send result
  const { statusCode, headers } = pageContext.httpResponse
  reply.statusCode = statusCode

  // Set headers from vike
  for (const [name, value] of headers) {
    reply.raw.setHeader(name, value)
  }

  pageContext.httpResponse.pipe(reply.raw)
}

export default frontendHandler
