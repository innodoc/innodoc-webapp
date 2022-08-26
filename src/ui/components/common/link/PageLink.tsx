import { forwardRef } from 'react'

import type { RootState } from '@/store/makeStore'
import { selectPageById } from '@/store/selectors/content/page'
import type { Page } from '@/types/api'
import Icon from '@/ui/components/common/Icon'
import { useSelector } from '@/ui/hooks/store'
import { pageUrl } from '@/utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

const PageLinkPage = forwardRef<HTMLAnchorElement, Omit<PageLinkProps, 'pageId'>>(
  function PageLinkPage({ children, page, preferShortTitle = false, ...other }, ref) {
    if (page === undefined) return null
    const { id, icon, shortTitle, title } = page

    return (
      <InternalLink to={pageUrl(id)} ref={ref} {...other}>
        {children || (
          <>
            {icon !== undefined ? <Icon name={icon} /> : null}
            {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
          </>
        )}
      </InternalLink>
    )
  }
)

const PageLinkPageId = forwardRef<HTMLAnchorElement, Omit<PageLinkProps, 'page'>>(
  function PageLinkPageId({ pageId, ...other }, ref) {
    const selectPage = (state: RootState) => selectPageById(state, pageId)
    const page = useSelector(selectPage)
    return <PageLinkPage ref={ref} page={page} {...other} />
  }
)

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { page, pageId, ...other },
  ref
) {
  if (page !== undefined && pageId !== undefined) {
    throw new Error('<PageLink> needs either page or pageId prop, not both.')
  }

  if (page !== undefined) {
    return <PageLinkPage ref={ref} page={page} {...other} />
  }

  if (pageId !== undefined) {
    return <PageLinkPageId ref={ref} pageId={pageId} {...other} />
  }

  throw new Error('<SectionLink> needs either section or sectionPath prop.')
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  page?: Page
  pageId?: Page['id']
}

export default PageLink
