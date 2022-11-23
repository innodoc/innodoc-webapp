import { resolveRoute } from 'vite-plugin-ssr/routing'

import type { PageContextServer } from '#types/pageContext'

// Extract pageId from URL
export default (pageContext: PageContextServer) =>
  resolveRoute(`/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/@pageName`, pageContext.urlPathname)
