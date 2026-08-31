import type { LinkProps } from './types.js'
import type { FrontendRouteInfo, LanguageCode } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useRoutes, useSelector } from '@innodoc/ui-shared/store-hooks'
import BaseLink from './BaseLink.js'
import tryGenerateUrl from './try-generate-url.js'

/**
 * Link to the current route in another locale.
 *
 * Unlike {@link AppLink}, this keeps the current route (page, section, progress, ...) and only swaps
 * the locale, so it does not resolve route content (no title lookup) and does not replace a course
 * index route with the course home link - both would pin the link to the *current* locale.
 */
function LocaleLink({ ref, children, locale, ...other }: LocaleLinkProps) {
  const { url } = useRoutes()
  const routeInfo = useSelector(selectRouteInfo)

  const href = tryGenerateUrl(url, { ...routeInfo, locale } satisfies Partial<FrontendRouteInfo>)

  if (href === null) {
    return null
  }

  return (
    <BaseLink ref={ref} to={href} {...other}>
      {children}
    </BaseLink>
  )
}

interface LocaleLinkProps extends Omit<LinkProps, 'to'> {
  /** Target locale */
  locale: LanguageCode
}

export default LocaleLink
