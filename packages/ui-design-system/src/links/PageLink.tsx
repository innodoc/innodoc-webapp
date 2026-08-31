import type { LinkProps } from './types.js'
import { Trans } from 'react-i18next'
import type { ApiPage, TranslatedPage } from '@innodoc/shared-core/types'
import { useRoutes, useSelectPage } from '@innodoc/ui-shared/store-hooks'
import { InlineError } from '#errors'
import { Code, Icon } from '#misc'
import BaseLink from './BaseLink.js'
import tryGenerateUrl from './try-generate-url.js'

/** Link to a page using `pageSlug` */
function PageLinkFromSlug({ ref, pageSlug, ...other }: PageLinkFromSlugProps) {
  const { page } = useSelectPage(pageSlug)

  if (page === undefined) {
    return (
      <InlineError>
        <Trans i18nKey="error.pageLinkPageSlugProp" components={{ 0: <Code />, 2: <Code /> }} values={{ pageSlug }}>
          {`<0>PageLink</0>: <2>{{pageSlug}}</2> not found`}
        </Trans>
      </InlineError>
    )
  }

  return <PageLink ref={ref} page={page} {...other} />
}

interface PageLinkFromSlugProps extends Omit<PageLinkProps, 'page'> {
  pageSlug: ApiPage['slug']
}

/** Link to a page */
function PageLink({ ref, children, page, preferShortTitle = false, showIcon = true, ...other }: PageLinkProps) {
  const { url } = useRoutes()
  const { slug, icon, shortTitle, title } = page
  const href = tryGenerateUrl(url, { name: 'app:course:page', pageSlug: slug })

  if (href === null) {
    return null
  }

  return (
    <BaseLink to={href} ref={ref} {...other}>
      {children ?? (
        <>
          {showIcon && icon ? <Icon name={icon} /> : null}
          {(preferShortTitle && shortTitle ? shortTitle : title) ?? null}
        </>
      )}
    </BaseLink>
  )
}

interface PageLinkProps extends Omit<LinkProps, 'to'> {
  page: TranslatedPage
  preferShortTitle?: boolean
  showIcon?: boolean
}

export { PageLinkFromSlug }
export default PageLink
