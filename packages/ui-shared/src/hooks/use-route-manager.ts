import { use } from 'react'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'

function useRouteManager() {
  const routeManager = use(RouteManagerContext)

  if (!routeManager) {
    throw TypeError('Expected routeManager')
  }

  return routeManager
}

export default useRouteManager
