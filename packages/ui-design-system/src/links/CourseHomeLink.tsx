import type { LinkProps } from './types.js'
import { useRoutes, useSelectCurrentCourse } from '@innodoc/ui-shared/store-hooks'
import BaseLink from './BaseLink.js'

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

  return (
    <BaseLink to={url(routeInfo)} ref={ref} {...props}>
      {content}
    </BaseLink>
  )
}

type HomeLinkProps = Omit<LinkProps, 'to'>

export default CourseHomeLink
