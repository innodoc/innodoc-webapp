import { forwardRef } from 'react'

import type { RootState } from '#store/makeStore'
import { selectPageById } from '#store/selectors/content/page'
import type { Page } from '#types/api'
import InlineError from '#ui/components/common/error/InlineError'
import Icon from '#ui/components/common/Icon'
import { useSelector } from '#ui/hooks/store'
import { getPageUrl } from '#utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

/** PageLinkPage takes `page` */
const PageLinkPage = forwardRef<HTMLAnchorElement, PageLinkPageProps>(function PageLinkPage(
  { children, page, preferShortTitle = false, ...other },
  ref
) {
  if (page === undefined) return null
  const { id, icon, shortTitle, title } = page

  return (
    <InternalLink to={getPageUrl(id)} ref={ref} {...other}>
      {children || (
        <>
          {icon !== undefined ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
        </>
      )}
    </InternalLink>
  )
})

type PageLinkPageProps = Omit<PageLinkProps, 'page' | 'pageId'> & {
  page: Page
}

/** PageLinkPageId takes `pageId` */
const PageLinkPageId = forwardRef<HTMLAnchorElement, PageLinkPageIdProps>(function PageLinkPageId(
  { pageId: pageIdFull, ...other },
  ref
) {
  const [pageId, hash] = pageIdFull.split('#')
  const selectPage = (state: RootState) => selectPageById(state, pageId)
  const page = useSelector(selectPage)
  if (page === undefined) {
    return <InlineError>PageLink: Page ID &quot;{pageId}&quot; not found!</InlineError>
  }

  return <PageLinkPage hash={hash} ref={ref} page={page} {...other} />
})

type PageLinkPageIdProps = Omit<PageLinkProps, 'page' | 'pageId'> & {
  pageId: Page['id']
}

/** PageLink takes either `page` or `pageId` */
const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { page, pageId, ...other },
  ref
) {
  if (page !== undefined && pageId !== undefined) {
    return (
      <InlineError>
        PageLink: Set either &quot;page&quot; or &quot;pageId&quot; prop, not both!
      </InlineError>
    )
  }

  if (page !== undefined) {
    return <PageLinkPage ref={ref} page={page} {...other} />
  }

  if (pageId !== undefined) {
    return <PageLinkPageId ref={ref} pageId={pageId} {...other} />
  }

  return (
    <InlineError>PageLink: Needs either &quot;page&quot; or &quot;pageId&quot; prop!</InlineError>
  )
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  page?: Page
  pageId?: Page['id']
}

export default PageLink
