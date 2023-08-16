import { Children, forwardRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { RouteInfo } from '@innodoc/routes/types'

import builtInPages from '#components/common/built-in-pages'
import useRouteManager from '#hooks/routes'

import BaseLink from './BaseLink'
import HomeLink from './HomeLink'
import { PageLinkFromSlug } from './PageLink'
import { SectionLinkFromPath } from './SectionLink'
import type { LinkProps } from './types'

/** App-internal link */
const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { children, routeInfo, ...other },
  ref
) {
  const { t } = useTranslation()
  const { generateUrl } = useRouteManager()

  // Determine content
  let content: ReactNode = children
  if (Children.count(children) === 0) {
    const page = builtInPages.find((page) => page.routeName === routeInfo.routeName)
    if (page) {
      content = t(page.title)
    }
  }

  // Page link
  if (routeInfo.routeName === 'app:page' && routeInfo.pageSlug) {
    return (
      <PageLinkFromSlug pageSlug={routeInfo.pageSlug} ref={ref} showIcon={false} {...other}>
        {content}
      </PageLinkFromSlug>
    )
  }

  // Section link
  if (routeInfo.routeName === 'app:section' && routeInfo.sectionPath) {
    return (
      <SectionLinkFromPath sectionPath={routeInfo.sectionPath} ref={ref} {...other}>
        {content}
      </SectionLinkFromPath>
    )
  }

  // Home link
  if (routeInfo.routeName === 'app:home') {
    return (
      <HomeLink ref={ref} {...other}>
        {content}
      </HomeLink>
    )
  }

  // Other route
  return (
    <BaseLink to={generateUrl(routeInfo)} ref={ref} {...other}>
      {content}
    </BaseLink>
  )
})

interface AppLinkProps extends Omit<LinkProps, 'to'> {
  routeInfo: Partial<RouteInfo>
}

export default AppLink
