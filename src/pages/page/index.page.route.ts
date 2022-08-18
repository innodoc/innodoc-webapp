import { resolveRoute } from 'vite-plugin-ssr/routing'

import { PageContextServer } from '@/types/page'

// Extract pageId from URL
export default (pageContext: PageContextServer) => {
  return resolveRoute(
    `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/@pageId`,
    pageContext.urlPathname
  )
}
