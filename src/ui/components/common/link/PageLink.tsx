import { forwardRef } from 'react'

import type { RootState } from '#store/makeStore'
import { selectPageByName } from '#store/selectors/content/page'
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
  const { name, icon, shortTitle, title } = page

  return (
    <InternalLink to={getPageUrl(name)} ref={ref} {...other}>
      {children || (
        <>
          {icon !== undefined ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
        </>
      )}
    </InternalLink>
  )
})

type PageLinkPageProps = Omit<PageLinkProps, 'page' | 'pageName'> & {
  page: Page
}

/** PageLinkPageName takes `pageName` */
const PageLinkPageName = forwardRef<HTMLAnchorElement, PageLinkPageNameProps>(
  function PageLinkPageName({ pageName: pageNameFull, ...other }, ref) {
    const [pageName, hash] = pageNameFull.split('#')
    const selectPage = (state: RootState) => selectPageByName(state, pageName)
    const page = useSelector(selectPage)
    if (page === undefined) {
      return <InlineError>PageLink: Page &quot;{pageName}&quot; not found!</InlineError>
    }

    return <PageLinkPage hash={hash} ref={ref} page={page} {...other} />
  }
)

type PageLinkPageNameProps = Omit<PageLinkProps, 'page' | 'pageName'> & {
  pageName: Page['name']
}

/** PageLink takes either `page` or `pageName` */
const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { page, pageName, ...other },
  ref
) {
  if (page !== undefined && pageName !== undefined) {
    return (
      <InlineError>
        PageLink: Set either &quot;page&quot; or &quot;pageName&quot; prop, not both!
      </InlineError>
    )
  }

  if (page !== undefined) {
    return <PageLinkPage ref={ref} page={page} {...other} />
  }

  if (pageName !== undefined) {
    return <PageLinkPageName ref={ref} pageName={pageName} {...other} />
  }

  return (
    <InlineError>PageLink: Needs either &quot;page&quot; or &quot;pageName&quot; prop!</InlineError>
  )
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  page?: Page
  pageName?: Page['name']
}

export default PageLink
