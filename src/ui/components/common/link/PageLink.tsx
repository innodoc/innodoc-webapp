import { forwardRef } from 'react'

import type { Page } from '@/types/api'
import { pageUrl } from '@/utils/url'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { pageId, ...other },
  ref
) {
  return <InternalLink to={pageUrl(pageId)} ref={ref} {...other} />
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  pageId: Page['id']
}

export default PageLink
