import { forwardRef } from 'react'

import { useSelectCurrentCourse } from '@innodoc/ui-store/hooks'

import SpecLink from './SpecLink.js'
import type { LinkProps } from './types.js'

/** Link to home as specified in course */
const CourseHomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink({ children, ...props }, ref) {
  const { course } = useSelectCurrentCourse()

  if (!course) {
    return null
  }

  const title = course.shortTitle ?? course.title
  const content = children ?? title

  return (
    <SpecLink to={course.homeLink} ref={ref} {...props}>
      {content}
    </SpecLink>
  )
})

type HomeLinkProps = Omit<LinkProps, 'to'>

export default CourseHomeLink
