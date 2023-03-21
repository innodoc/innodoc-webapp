import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import getRouteManager from '#routes/getRouteManager'
import InlineError from '#ui/components/common/error/InlineError'

import BuiltinPageLink from './BuiltinPageLink'
import ExternalLink from './ExternalLink'
import PageLink from './PageLink'
import SectionLink from './SectionLink'
import type { LinkProps } from './types'

const routeManager = getRouteManager()

const contentPageSpecifierRegEx = /^app:(?:section|page)\|/

const ALLOWED_PROTOCOLS = ['https:', 'http:', 'mailto:']

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
  let url: URL | undefined = undefined
  try {
    url = new URL(to)
  } catch {
    // pass
  }
  if (url !== undefined && ALLOWED_PROTOCOLS.includes(url.protocol)) {
    return <ExternalLink href={to} ref={ref} {...other} />
  }

  return (
    <InlineError>
      <Trans i18nKey="error.unhandledLink" components={{ 1: <code /> }} values={{ to }}>
        {`Unhandled link: <1>{{to}}</1>`}
      </Trans>
    </InlineError>
  )
})

export default GeneralLink
