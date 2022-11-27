import { forwardRef } from 'react'

import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'

import ContentLink from './ContentLink'
import type { InternalLinkProps } from './InternalLink'

const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const { course } = useSelectCurrentCourse()

  if (course === undefined) return null

  return <ContentLink ref={ref} to={course.homeLink} {...props} />
})

type HomeLinkProps = Omit<InternalLinkProps, 'to'>

export default HomeLink
