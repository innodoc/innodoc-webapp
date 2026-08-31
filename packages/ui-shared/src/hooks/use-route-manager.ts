import { use } from 'react'
import { RouteManagerContext } from '@innodoc/shared-core/routes'

function useRouteManager() {
  const routeManager = use(RouteManagerContext)

  if (!routeManager) {
    throw new TypeError('Expected routeManager')
  }

  return routeManager
}

export default useRouteManager
