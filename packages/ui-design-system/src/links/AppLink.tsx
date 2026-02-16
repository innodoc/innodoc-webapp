import { Children, forwardRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { isAppRouteInfo, isCoursePageRouteInfo, isCourseSectionRouteInfo } from '@innodoc/shared-core/routes/typeguards'

import pageLinks from '#pageLinks'

import BaseLink from './BaseLink.js'
import CourseHomeLink from './CourseHomeLink.js'
import { PageLinkFromSlug } from './PageLink.js'
import { SectionLinkFromPath } from './SectionLink.js'
import type { LinkProps } from './types.js'

/** App-internal link */
const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink({ children, routeInfo, ...other }, ref) {
  const { t } = useTranslation()
  const { url } = useRouteManager()

  if (!isAppRouteInfo(routeInfo)) {
    return null
  }

  // Determine content
  let content: ReactNode = children
  if (Children.count(children) === 0) {
    const page = pageLinks.find((page) => page.routeName === routeInfo.name)
    if (page?.title) {
      content = t(page.title)
    }
  }

  // Page link
  if (isCoursePageRouteInfo(routeInfo)) {
    return (
      <PageLinkFromSlug pageSlug={routeInfo.pageSlug} ref={ref} showIcon={false} {...other}>
        {content}
      </PageLinkFromSlug>
    )
  }

  // Section link
  if (isCourseSectionRouteInfo(routeInfo)) {
    return (
      <SectionLinkFromPath sectionPath={routeInfo.sectionPath} ref={ref} {...other}>
        {content}
      </SectionLinkFromPath>
    )
  }

  // Home link
  if (routeInfo.name === 'app:course:index') {
    return (
      <CourseHomeLink ref={ref} {...other}>
        {content}
      </CourseHomeLink>
    )
  }

  // Other route
  return (
    <BaseLink to={url(routeInfo)} ref={ref} {...other}>
      {content}
    </BaseLink>
  )
})

interface AppLinkProps extends Omit<LinkProps, 'to'> {
  routeInfo: unknown
}

export default AppLink
