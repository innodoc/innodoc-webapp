import { forwardRef } from 'react'

import { selectHomeLink } from '#store/selectors/content/course'
import { useSelector } from '#ui/hooks/store'

import ContentLink from './ContentLink'
import type { InternalLinkProps } from './InternalLink'

const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const homeLink = useSelector(selectHomeLink)
  if (homeLink === undefined) return null

  return <ContentLink ref={ref} to={homeLink} {...props} />
})

type HomeLinkProps = Omit<InternalLinkProps, 'to'>

export default HomeLink
