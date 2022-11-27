import { type RequestHandler, Router } from 'express'
import type { LanguageCode } from 'iso-639-1'
import { renderPage } from 'vite-plugin-ssr'

import type { ApiCourse } from '#types/entities/course'
import { extractLocale, formatUrl } from '#utils/url'

const frontendRouter = Router().get('*', (async (req, res, next) => {
  const url = req.originalUrl

  // Extract locale from URL, fallback to browser Accept-Language
  const { locale, urlWithoutLocale } = extractLocale(url, req.rawLocale.language as LanguageCode)
  const pageContextInit: PageContextInit = {
    locale,
    urlOriginal: urlWithoutLocale,
    // TODO: extract from domain name, url path and fallback?, something like
    // https://github.com/edwardhotchkiss/subdomain
    courseName: 'innodoc',
  }

  // Ensure url path is prefixed with locale
  if (url.split('/')[1] !== locale) {
    return res.redirect(307, formatUrl(url, locale))
  }

  // Render page
  const pageContext = await renderPage(pageContextInit)

  // Follow redirection directive from app
  if (pageContext.redirectTo !== undefined) {
    return res.redirect(307, pageContext.redirectTo)
  }

  if (!pageContext.httpResponse) {
    return next()
  }

  const { body, statusCode, contentType } = pageContext.httpResponse
  return res.status(statusCode).type(contentType).send(body)
}) as RequestHandler) // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

type PageContextInit = {
  locale: LanguageCode
  courseName: ApiCourse['name']
  urlOriginal: string
  redirectTo?: string
}

export default frontendRouter
