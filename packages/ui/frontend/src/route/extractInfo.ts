import isLocale from 'validator/lib/isLocale.js'
import isSlug from 'validator/lib/isSlug.js'
import type { LanguageCode } from 'iso-639-1'

import { ExtractionError } from './errors.js'

/**
 * Extract locale from URL path.
 *
 * @param urlPathname URL path
 * @returns locale
 *
 * @throws {ExtractionError} if it failed to extract locale
 **/
function extractLocale(urlPathname: string): LanguageCode {
  const [, locale] = urlPathname.split('/')
  if (isLocale(locale ?? '')) {
    return locale as LanguageCode
  }
  throw new ExtractionError()
}

/**
 * Extract course slug from domain name.
 *
 * @param host hostname
 * @returns course slug
 *
 * @throws {ExtractionError} if it failed to extract course slug
 **/
function extractCourseSlugFromDomain(host: string): string {
  const domainParts = host.split('.')
  if (domainParts.length > 2) {
    const maybeSlug = domainParts[0]
    if (maybeSlug !== undefined && isSlug(maybeSlug)) {
      return maybeSlug
    }
  }
  throw new ExtractionError()
}

export { extractCourseSlugFromDomain, extractLocale }
