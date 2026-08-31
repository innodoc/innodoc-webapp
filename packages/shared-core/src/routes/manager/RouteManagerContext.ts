import type RouteManager from './RouteManager.js'
import type { PropsWithChildren } from 'react'
import { createContext, createElement } from 'react'

/** Context providing the current {@link RouteManager} to the React tree. */
const RouteManagerContext = createContext<RouteManager | undefined>(undefined)

interface RouteManagerProviderProps extends PropsWithChildren {
  routeManager: RouteManager
}

/** Provide a {@link RouteManager} to the React tree. */
function RouteManagerProvider({ routeManager, children }: RouteManagerProviderProps) {
  return createElement(RouteManagerContext, { value: routeManager }, children)
}

export { RouteManagerProvider }
export default RouteManagerContext
