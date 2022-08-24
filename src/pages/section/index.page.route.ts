import { resolveRoute } from 'vite-plugin-ssr/routing'

import { PageContextServer } from '@/types/page'

// Extract sectionPath from URL
export default (pageContext: PageContextServer) => {
  const result = resolveRoute(
    `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/*`,
    pageContext.urlPathname
  )
  return result.match
    ? {
        match: true,
        routeParams: { sectionPath: result.routeParams['*'] },
      }
    : false
}
