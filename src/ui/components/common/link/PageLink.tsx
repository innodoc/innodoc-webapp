import { Children, forwardRef } from 'react'
import { Trans } from 'react-i18next'

import useSelectPage from '#store/hooks/useSelectPage'
import type { ApiPage, TranslatedPage } from '#types/entities/page'
import InlineError from '#ui/components/common/error/InlineError'
import Icon from '#ui/components/common/Icon'
import { getPageUrl } from '#utils/url'

import InternalLink from './InternalLink'
import type { LinkProps } from './types'

/** PageLinkPage takes `page` */
const PageLinkPage = forwardRef<HTMLAnchorElement, PageLinkPageProps>(function PageLinkPage(
  { children, page, preferShortTitle = false, ...other },
  ref
) {
  const { slug, icon, shortTitle, title } = page

  return (
    <InternalLink to={getPageUrl(slug)} ref={ref} {...other}>
      {Children.count(children) ? (
        children
      ) : (
        <>
          {icon !== undefined ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
        </>
      )}
    </InternalLink>
  )
})

interface PageLinkPageProps extends Omit<PageLinkProps, 'page' | 'pageSlug'> {
  page: TranslatedPage
}

/** PageLinkPageSlug takes `pageSlug` */
const PageLinkPageSlug = forwardRef<HTMLAnchorElement, PageLinkPageSlugProps>(
  function PageLinkPageSlug({ pageSlug: pageSlugFull, ...other }, ref) {
    const [pageSlug, hash] = pageSlugFull.split('#')
    const { page } = useSelectPage(pageSlug)

    if (page === undefined) {
      return (
        <InlineError>
          <Trans
            i18nKey="error.pageLinkPageSlugProp"
            components={{ 0: <code />, 2: <code /> }}
            values={{ pageSlug }}
          >
            {`<0>PageLink</0>: Page <2>{{pageSlug}}</2> not found.`}
          </Trans>
        </InlineError>
      )
    }

    return <PageLinkPage hash={hash} ref={ref} page={page} {...other} />
  }
)

interface PageLinkPageSlugProps extends Omit<PageLinkProps, 'page' | 'pageSlug'> {
  pageSlug: ApiPage['slug']
}

/** PageLink takes either `page` or `pageSlug` */
const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { page, pageSlug, ...other },
  ref
) {
  if (page !== undefined && pageSlug !== undefined) {
    throw new Error('Use either page or pageSlug prop, not both.')
  }

  if (page !== undefined) {
    return <PageLinkPage ref={ref} page={page} {...other} />
  }

  if (pageSlug !== undefined) {
    return <PageLinkPageSlug ref={ref} pageSlug={pageSlug} {...other} />
  }

  throw new Error('Use either page or pageSlug prop.')
})

interface PageLinkProps extends Omit<LinkProps, 'to'> {
  preferShortTitle?: boolean
  page?: TranslatedPage
  pageSlug?: ApiPage['slug']
}

export default PageLink
