import { forwardRef } from 'react'

import getRouteManager from '#routes/getRouteManager'

import BuiltinPageLink from './BuiltinPageLink'
import ExternalLink from './ExternalLink'
import PageLink from './PageLink'
import SectionLink from './SectionLink'
import type { LinkProps } from './types'

const routeManager = getRouteManager()

const contentPageSpecifierRegEx = /^app:(?:section|page)\|/

/**
 * General link
 *
 * Supports all types of links, e.g. internal link specifier and external URL.
 */
const GeneralLink = forwardRef<HTMLAnchorElement, LinkProps>(function GeneralLink(
  { to, ...other },
  ref
) {
  // Built-in page
  if (routeManager.isBuiltinPageRouteName(to)) {
    return <BuiltinPageLink to={to} ref={ref} {...other} />
  }

  // Content page link
  if (contentPageSpecifierRegEx.test(to)) {
    const [routeName, params] = routeManager.generateParamsFromSpecifier(to)
    return routeName === 'app:page' ? (
      <PageLink pageSlug={params.pageSlug} ref={ref} {...other} />
    ) : (
      <SectionLink sectionPath={params.sectionPath} ref={ref} {...other} />
    )
  }

  // External link
  return <ExternalLink href={to} ref={ref} {...other} />
})

export default GeneralLink
