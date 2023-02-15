import { forwardRef } from 'react'

import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'

import ContentLink from './ContentLink'
import type { LinkProps } from './types'

const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const { course } = useSelectCurrentCourse()

  if (course === undefined) return null

  return <ContentLink ref={ref} to={course.homeLink} {...props} />
})

type HomeLinkProps = Omit<LinkProps, 'to'>

export default HomeLink
