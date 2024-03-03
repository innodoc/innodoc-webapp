import { isNativeError } from 'node:util/types'

import { renderPage } from 'vike/server'

import { asyncWrapper } from './utils'

const frontendHandler = asyncWrapper(async (req, res) => {
  // Create page context
  const pageContextInit = {
    host: req.headers.host,
    requestLocale: req.rawLocale.language,
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
    return
  }

  // Send result
  const { body, statusCode, headers } = pageContext.httpResponse
  res.status(statusCode)
  headers.forEach(([name, value]) => res.setHeader(name, value))
  res.send(body)
})

export default frontendHandler
