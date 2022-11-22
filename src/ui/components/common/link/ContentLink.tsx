import { forwardRef } from 'react'

import InlineError from '#ui/components/common/error/InlineError'

import type { InternalLinkProps } from './InternalLink'
import PageLink from './PageLink'
import SectionLink from './SectionLink'

const ContentLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(function ContentLink(
  { to, ...other },
  ref
) {
  if (to.startsWith('/section/')) {
    const sectionPath = to.replace(/^\/section\//, '')
    return <SectionLink ref={ref} sectionPath={sectionPath} {...other} />
  }

  if (to.startsWith('/page/')) {
    const pageId = to.replace(/^\/page\//, '')
    return <PageLink pageId={pageId} ref={ref} {...other} />
  }

  return (
    <InlineError>
      ContentLink: prop &qout;to&qout; (<code>{to}</code>) needs to start with either
      &qout;/section/&qout; or &qout;/page/&qout;
    </InlineError>
  )
})

export default ContentLink
