import { forwardRef } from 'react'
import { Trans } from 'react-i18next'

import InlineError from '#ui/components/common/error/InlineError'

import PageLink from './PageLink'
import SectionLink from './SectionLink'
import type { LinkProps } from './types'

const ContentLink = forwardRef<HTMLAnchorElement, LinkProps>(function ContentLink(
  { to, ...other },
  ref
) {
  if (to.startsWith('/section/')) {
    const sectionPath = to.replace(/^\/section\//, '')
    return <SectionLink ref={ref} sectionPath={sectionPath} {...other} />
  }

  if (to.startsWith('/page/')) {
    const pageSlug = to.replace(/^\/page\//, '')
    return <PageLink pageSlug={pageSlug} ref={ref} {...other} />
  }

  return (
    <InlineError>
      <Trans i18nKey="error.contentLinkToProp">
        <code>ContentLink:</code> Prop <code>to</code> needs to start with either{' '}
        <code>/section/</code> or <code>/page/</code>.
      </Trans>
    </InlineError>
  )
})

export default ContentLink
