import { createContext } from 'react'
import type { PropsWithChildren } from 'react'

import type { RouteManager } from '@innodoc/shared-core/routes'

const RouteManagerContext = createContext<RouteManager | undefined>(undefined)

function RouteManagerProvider({ routeManager, children }: RouteManagerProviderProps) {
  return <RouteManagerContext value={routeManager}>{children}</RouteManagerContext>
}

interface RouteManagerProviderProps extends PropsWithChildren {
  routeManager: RouteManager
}

export { RouteManagerProvider }
export default RouteManagerContext
