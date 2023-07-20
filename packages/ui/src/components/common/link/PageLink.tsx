import { Children, forwardRef } from 'react'
import { Trans } from 'react-i18next'

import type { ApiPage, TranslatedPage } from '@innodoc/types/entities'

import { Code, Icon, InlineError } from '#components/common'
import useRouteManager from '#hooks/routes'
import { useSelectPage } from '#hooks/store'

import BaseLink from './BaseLink'
import type { LinkProps } from './types'

/** Link to a page using `pageSlug` */
const PageLinkFromSlug = forwardRef<HTMLAnchorElement, PageLinkFromSlugProps>(
  function PageLinkFromSlug({ pageSlug, ...other }, ref) {
    const { page } = useSelectPage(pageSlug)

    if (page === undefined) {
      return (
        <InlineError>
          <Trans
            i18nKey="error.pageLinkPageSlugProp"
            components={{ 0: <Code />, 2: <Code /> }}
            values={{ pageSlug }}
          >
            {`<0>PageLink</0>: <2>{{pageSlug}}</2> not found`}
          </Trans>
        </InlineError>
      )
    }

    return <PageLink ref={ref} page={page} {...other} />
  }
)

interface PageLinkFromSlugProps extends Omit<PageLinkProps, 'page'> {
  pageSlug: ApiPage['slug']
}

/** Link to a page */
const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
  { children, page, preferShortTitle = false, showIcon = true, ...other },
  ref
) {
  const { generateUrl } = useRouteManager()
  const { slug, icon, shortTitle, title } = page

  return (
    <BaseLink to={generateUrl({ routeName: 'app:page', pageSlug: slug })} ref={ref} {...other}>
      {Children.count(children) ? (
        children
      ) : (
        <>
          {showIcon && icon !== undefined ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle !== undefined ? shortTitle : title) || null}
        </>
      )}
    </BaseLink>
  )
})

interface PageLinkProps extends Omit<LinkProps, 'to'> {
  page: TranslatedPage
  preferShortTitle?: boolean
  showIcon?: boolean
}

export { PageLinkFromSlug }
export default PageLink
