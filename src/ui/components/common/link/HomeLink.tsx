import { forwardRef } from 'react'

import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'

import SpecLink from './SpecLink'
import type { LinkProps } from './types'

/** Link to home as specified in course */
const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const { course } = useSelectCurrentCourse()

  if (!course) {
    return null
  }

  return <SpecLink to={course.homeLink} ref={ref} {...props} />
})

type HomeLinkProps = Omit<LinkProps, 'to'>

export default HomeLink
