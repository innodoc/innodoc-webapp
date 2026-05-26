import type { LinkProps } from './types.js'
import { useSelectCurrentCourse } from '@innodoc/ui-store/hooks'
import SpecLink from './SpecLink.js'

/** Link to home as specified in course */
function CourseHomeLink({ ref, children, ...props }: HomeLinkProps) {
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
}

type HomeLinkProps = Omit<LinkProps, 'to'>

export default CourseHomeLink
