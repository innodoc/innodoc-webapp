import type { LinkProps } from './types.js'
import { useRoutes, useSelectCurrentCourse } from '@innodoc/ui-shared/store-hooks'
import BaseLink from './BaseLink.js'
import tryGenerateUrl from './try-generate-url.js'

/** Link to home as specified in course */
function CourseHomeLink({ ref, children, ...props }: HomeLinkProps) {
  const { course } = useSelectCurrentCourse()
  const { url, parseLinkSpecifier } = useRoutes()

  if (!course) {
    return null
  }

  const title = course.shortTitle ?? course.title
  const content = children ?? title
  const routeInfo = parseLinkSpecifier(course.homeLink)
  const href = tryGenerateUrl(url, routeInfo)

  if (href === null) {
    return null
  }

  return (
    <BaseLink to={href} ref={ref} {...props}>
      {content}
    </BaseLink>
  )
}

type HomeLinkProps = Omit<LinkProps, 'to'>

export default CourseHomeLink
