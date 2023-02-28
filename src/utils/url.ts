import type { LanguageCode } from 'iso-639-1'

import getRoutes from '#routes/getRoutes'
import type { TranslatedPage } from '#types/entities/page'
import { isContentType } from '#types/typeGuards'

import { getStringIdField } from './content'

const { generateUrl } = getRoutes()

/** Generate route URL path from paramers */
export function getUrl<Args extends object>(name: string, params: Args) {
  // Convert number values to string
  const paramsAsStrings = Object.fromEntries(
    Object.entries(params).map(([key, val]) => [
      key,
      typeof val === 'number' ? val.toString() : val,
    ])
  )

  // TODO: add hostname in domain path mode?

  return generateUrl(name, paramsAsStrings)
}

/** Generate page URL */
// TODO remove
export function getPageUrl(pageSlug: TranslatedPage['slug']) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageSlug}`
}

/** Parse internal link specifier such as `section|foo/bar` */
export function generateUrlFromSpecifier(specifier: string, locale: LanguageCode) {
  const [routeName, arg] = specifier.split('|')
  const [routeNameFirst, routeNameSecond] = routeName.split(':')
  if (routeNameFirst !== 'app') throw new Error(`Unhandled link specifier: ${specifier}`)
  const params: Record<string, string> = { locale }
  if (isContentType(routeNameSecond)) params[getStringIdField(routeNameSecond)] = arg
  return generateUrl(routeName, params)
}
