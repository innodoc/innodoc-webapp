import getRoutes from '#routes/getRoutes'
import type { PageContextServer } from '#types/pageContext'

const { matchUrl } = getRoutes()

// Extract sectionPath from URL
export default (pageContext: PageContextServer) => {
  const match = matchUrl('app:section', pageContext.urlPathname)
  return match
    ? {
        match: true,
        routeParams: {
          routeName: 'app:section',
          ...match.params,
        },
      }
    : false
}
