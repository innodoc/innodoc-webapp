import type { RequestHandler } from 'express'
import type { LanguageCode } from 'iso-639-1'

import { extractLocale as extractLocaleHelper } from '#utils/url'
import { formatUrl } from '#utils/url'

/** Extract locale from URL, fallback to browser Accept-Language */
const extractLocale: RequestHandler = (req, res, next) => {
  const headerLanguage = req.rawLocale.language as LanguageCode
  const { locale, urlWithoutLocale } = extractLocaleHelper(req.originalUrl, headerLanguage)
  req.locale = locale
  req.urlWithoutLocale = urlWithoutLocale

  // Ensure url path is prefixed with locale
  if (req.originalUrl.split('/')[1] === locale) next()
  else res.redirect(307, formatUrl(urlWithoutLocale, locale))
}

export default extractLocale
