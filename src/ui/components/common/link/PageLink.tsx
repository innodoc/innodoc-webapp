import { forwardRef } from 'react'

import useSelectPage from '#store/hooks/useSelectPage'
import type { ApiPage, TranslatedPage } from '#types/entities/page'
import InlineError from '#ui/components/common/error/InlineError'
import Icon from '#ui/components/common/Icon'
import { getPageUrl } from '#utils/content'

import InternalLink, { type InternalLinkProps } from './InternalLink'

/** PageLinkPage takes `page` */
const PageLinkPage = forwardRef<HTMLAnchorElement, PageLinkPageProps>(function PageLinkPage(
  { children, page, preferShortTitle = false, ...other },
  ref
) {
  const { slug, icon, shortTitle, title } = page

  return (
    <InternalLink to={getPageUrl(slug)} ref={ref} {...other}>
      {children || (
        <>
          {icon !== undefined ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
        </>
      )}
    </InternalLink>
  )
})

type PageLinkPageProps = Omit<PageLinkProps, 'page' | 'pageSlug'> & {
  page: TranslatedPage
}

/** PageLinkPageSlug takes `pageSlug` */
const PageLinkPageSlug = forwardRef<HTMLAnchorElement, PageLinkPageSlugProps>(
  function PageLinkPageSlug({ pageSlug: pageSlugFull, ...other }, ref) {
    const [pageSlug, hash] = pageSlugFull.split('#')
    const { page } = useSelectPage(pageSlug)

    if (page === undefined) {
      return <InlineError>PageLink: Page &quot;{pageSlug}&quot; not found</InlineError>
    }

    return <PageLinkPage hash={hash} ref={ref} page={page} {...other} />
  }
)

type PageLinkPageSlugProps = Omit<PageLinkProps, 'page' | 'pageSlug'> & {
  pageSlug: ApiPage['slug']
}

/** PageLink takes either `page` or `pageSlug` */
const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { page, pageSlug, ...other },
  ref
) {
  if (page !== undefined && pageSlug !== undefined) {
    return (
      <InlineError>
        PageLink: Set either &quot;page&quot; or &quot;pageSlug&quot; prop, not both!
      </InlineError>
    )
  }

  if (page !== undefined) {
    return <PageLinkPage ref={ref} page={page} {...other} />
  }

  if (pageSlug !== undefined) {
    return <PageLinkPageSlug ref={ref} pageSlug={pageSlug} {...other} />
  }

  return (
    <InlineError>PageLink: Needs either &quot;page&quot; or &quot;pageSlug&quot; prop</InlineError>
  )
})

type PageLinkProps = Omit<InternalLinkProps, 'to'> & {
  preferShortTitle?: boolean
  page?: TranslatedPage
  pageSlug?: ApiPage['slug']
}

export default PageLink
