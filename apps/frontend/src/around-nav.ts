import type { AroundNavHandler } from 'wouter'
import { flushSync } from 'react-dom'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import { changeRouteInfo, changeRouteTransitionInfo, selectRouteInfo } from '@innodoc/shared-store/slices/app'
import type { Store } from '@innodoc/shared-store/types'
import { waitForRouteContentReady } from '@innodoc/shared-store/utils'

/**
 * Compare identity fields of two route infos.
 * Hash and search are intentionally ignored (wouter is pathname+search based).
 */
function isSameRouteInfo(a: FrontendRouteInfo, b: FrontendRouteInfo): boolean {
  return (
    a.name === b.name &&
    a.locale === b.locale &&
    ('courseSlug' in a ? a.courseSlug : undefined) === ('courseSlug' in b ? b.courseSlug : undefined) &&
    ('pageSlug' in a ? a.pageSlug : undefined) === ('pageSlug' in b ? b.pageSlug : undefined) &&
    ('sectionPath' in a ? a.sectionPath : undefined) === ('sectionPath' in b ? b.sectionPath : undefined)
  )
}

/** URL path without hash and search (wouter `to` may include both) */
function pathOf(to: string): string {
  const [withoutHash = ''] = to.split('#')
  const [withoutSearch = ''] = withoutHash.split('?')
  return withoutSearch
}

/** Scroll to hash */
function scrollToHash() {
  let { hash } = globalThis.location
  hash = hash.slice(1)
  if (!hash) {
    return
  }

  const el: HTMLElement | null = document.querySelector(`#${hash}`)
  if (!el) {
    return
  }

  globalThis.queueMicrotask(() => {
    el.scrollIntoView()
  })
}

/** Scroll to the hash target if present, otherwise to the top (page change) */
function scrollAfterNavigate() {
  if (globalThis.location.hash) {
    scrollToHash()
  } else {
    globalThis.scrollTo({ left: 0, top: 0 })
  }
}

/**
 * Create a wouter `aroundNav` handler that animates page transitions with the
 * View Transitions API.
 *
 * This is the single entry point for all client navigations (link clicks,
 * back/forward, programmatic `navigate`). It triggers the existing fetch
 * pipeline via `changeRouteTransitionInfo`, awaits content readiness, then
 * atomically swaps the Redux route and the wouter location inside
 * `document.startViewTransition`, so the crossfade always lands on a fully
 * rendered page.
 */
function makeAroundNav(routeManager: RouteManager, store: Store): AroundNavHandler {
  return (navigate, to, options) => {
    // Fallback: SSR, jsdom, or engines without View Transitions API support
    if (import.meta.env.SSR || typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
      navigate(to, options)
      return
    }

    // Parse target; self-navigation (e.g. hash-only) → plain navigate, no snapshot churn
    const routeInfo = routeManager.parseRouteFromUrl(pathOf(to))
    const current = selectRouteInfo(store.getState())
    if (!routeInfo || isSameRouteInfo(routeInfo, current)) {
      navigate(to, options)
      scrollToHash()
      return
    }

    // Trigger fetch pipeline, wait for content, then animate the swap
    void (async () => {
      store.dispatch(changeRouteTransitionInfo(routeInfo))
      await waitForRouteContentReady(store, routeManager, routeInfo)
      store.dispatch(changeRouteTransitionInfo(null)) // state hygiene

      document.startViewTransition(() => {
        flushSync(() => {
          store.dispatch(changeRouteInfo(routeInfo)) // store swap
          navigate(to, options) // wouter swap
        })
      })

      // New view is committed synchronously inside the callback above
      scrollAfterNavigate()
    })()
  }
}

export { makeAroundNav }
