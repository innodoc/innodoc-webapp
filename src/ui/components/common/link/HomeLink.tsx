import { forwardRef } from 'react'

import { selectHomeLink } from '@/store/selectors/content/course'
import { useSelector } from '@/ui/hooks/store'

import type { InternalLinkProps } from './InternalLink'
import PageLink from './PageLink'
import SectionLink from './SectionLink'

const HomeLink = forwardRef<HTMLAnchorElement, HomeLinkProps>(function HomeLink(props, ref) {
  const homeLink = useSelector(selectHomeLink)
  if (homeLink === undefined) return null

  if (homeLink.startsWith('/section/')) {
    const sectionPath = homeLink.replace(/^\/section\//, '')
    return <SectionLink ref={ref} sectionPath={sectionPath} {...props} />
  }

  if (homeLink.startsWith('/page/')) {
    const pageId = homeLink.replace(/^\/page\//, '')
    return <PageLink pageId={pageId} ref={ref} {...props} />
  }

  throw new Error('<HomeLink> homeLink needs to start with either "/section/" or "/page/".')
})

type HomeLinkProps = Omit<InternalLinkProps, 'to'>

export default HomeLink
