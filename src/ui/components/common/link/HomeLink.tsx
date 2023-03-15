import { forwardRef } from 'react'

import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'

import GeneralLink from './GeneralLink'
import type { LinkProps } from './types'

/** Link to home as specified in course */
const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const { course } = useSelectCurrentCourse()

  if (course === undefined) {
    return null
  }

  return <GeneralLink ref={ref} to={course.homeLink} {...props} />
})

type HomeLinkProps = Omit<LinkProps, 'to'>

export default HomeLink
