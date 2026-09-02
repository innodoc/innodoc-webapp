import type { RouteNavigator } from './route-navigator.js'
import { useEffect } from 'react'

/**
 * Keep the rendered route in step with the browser's back and forward buttons.
 *
 * wouter's `aroundNav` only wraps navigations the app performs itself. A history navigation is
 * resolved by the browser alone: the address bar moves, wouter reads the new pathname off its own
 * `popstate` subscription, and no app code runs. Since the app renders the route held in the store,
 * the view would stay behind the URL without this hook.
 *
 * Nothing is filtered here: the navigator already ignores a history entry that names the route being
 * rendered, which is what a hash- or search-only entry is. Those stay the browser's business, and it
 * scrolls to the target and restores the position of the entry by itself.
 *
 * @param routeNavigator Navigator that owns the route change pipeline
 */
function useHistorySync(routeNavigator: RouteNavigator) {
  useEffect(() => {
    const onPopState = () => {
      routeNavigator.syncWithLocation()
    }

    globalThis.addEventListener('popstate', onPopState)

    return () => {
      globalThis.removeEventListener('popstate', onPopState)
    }
  }, [routeNavigator])
}

export default useHistorySync
