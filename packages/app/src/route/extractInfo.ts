import type { LanguageCode } from 'iso-639-1'

import { isSlug } from '@innodoc/utils/content'
import { isLanguageCode } from '@innodoc/utils/typeGuards'

import { ExtractionError } from './errors'

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
  if (isLanguageCode(locale)) {
    return locale
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
  if (domainParts.length > 2 && isSlug(domainParts[0])) {
    return domainParts[0]
  }
  throw new ExtractionError()
}

/**
 * Extract course slug from URL path.
 *
 * @param urlPathname URL path
 * @returns course slug
 *
 * @throws {ExtractionError} if it failed to extract course slug
 **/
function extractCourseSlugFromUrl(urlPathname: string): string {
  const [, , courseSlug] = urlPathname.split('/')
  if (courseSlug && isSlug(courseSlug)) {
    return courseSlug
  }
  throw new ExtractionError()
}

export { extractCourseSlugFromDomain, extractCourseSlugFromUrl, extractLocale }
