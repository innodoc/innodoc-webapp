import { forwardRef } from 'react'

import type { Page } from '@/types/api'
import Icon from '@/ui/components/common/Icon'
import { pageUrl } from '@/utils/url'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { children, page: { id, icon, shortTitle, title }, preferShortTitle = false, ...other },
  ref
) {
  let childrenContent = children
  if (childrenContent === null) {
    childrenContent = (
      <>
        {icon !== undefined ? <Icon name={icon} /> : null}
        {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
      </>
    )
  }

  return (
    <InternalLink to={pageUrl(id)} ref={ref} {...other}>
      {childrenContent}
    </InternalLink>
  )
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  page: Page
}

export default PageLink
