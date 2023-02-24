import getRoutes from '#routes/getRoutes'
import type { PageContextServer } from '#types/pageContext'

const { matchUrl } = getRoutes()

// TODO Refactor this into function used by page/section

// Extract pageId from URL
export default (pageContext: PageContextServer) => {
  const match = matchUrl('app:page', pageContext.urlPathname)
  return match
    ? {
        match: true,
        routeParams: {
          routeName: 'app:page',
          ...match.params,
        },
      }
    : false
}
