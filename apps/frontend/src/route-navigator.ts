import type { AroundNavHandler } from 'wouter'
import { flushSync } from 'react-dom'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import {
  changeRouteInfo,
  changeRouteTransitionInfo,
  selectRouteInfo,
  selectRouteTransitionInfo,
} from '@innodoc/shared-store/slices/app'
import type { Store } from '@innodoc/shared-store/types'
import { waitForRouteContentReady } from '@innodoc/shared-store/utils'

/**
 * Moves the app between routes.
 *
 * What the app renders comes from the route in the store, never from the address bar, so a route
 * change is only complete once both have moved. Every entry point goes through the same pipeline:
 * load the target's content, then swap store and URL together, so the new view is always fully
 * rendered. The two entry points differ only in who owns the URL:
 *
 * - {@link RouteNavigator.aroundNav} wraps navigations the app performs itself (link clicks,
 *   programmatic `navigate`, `Redirect`). The pipeline writes the URL as part of the swap.
 * - {@link RouteNavigator.syncWithLocation} follows navigations the app did not perform, i.e. the
 *   browser's back and forward buttons. The history entry already exists and the address bar has
 *   already moved by the time this runs, so the pipeline must not write the URL again.
 */
interface RouteNavigator {
  /** wouter `aroundNav` handler for navigations the app performs itself. */
  aroundNav: AroundNavHandler
  /** Bring the rendered route in line with the document URL after a history navigation. */
  syncWithLocation: () => void
}

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

/** Whether a route swap can be animated: no View Transitions API in SSR, jsdom or older engines. */
function canAnimateSwap(): boolean {
  return !import.meta.env.SSR && typeof document !== 'undefined' && typeof document.startViewTransition === 'function'
}

/** What a route change takes care of besides the target URL */
interface ChangeRouteOptions {
  /**
   * Moves the URL to the target, in the same synchronous swap as the store. Absent when the URL is
   * already where the reader asked to be, which is the case for a history navigation: writing it
   * again would push a new entry, turning one back press into a step forward nobody asked for.
   */
  commitUrl?: () => void

  /**
   * Whether the app owns the scroll position. It does not for a history navigation, where the browser
   * restores the position the reader was at in that entry.
   */
  scroll: boolean
}

/**
 * Create the {@link RouteNavigator} for an app instance.
 *
 * @param routeManager Route manager, used to resolve a URL into a route
 * @param store Store that holds the rendered route
 * @returns Navigator to wire into wouter's `aroundNav` and the history subscription
 */
function makeRouteNavigator(routeManager: RouteManager, store: Store): RouteNavigator {
  // Navigations overlap: each waits for its own content before committing. Only the newest one may
  // commit, so a slow response for a page the user has left cannot overwrite the route they landed on.
  let navigations = 0

  /**
   * Load the content of `to`, then commit it together with the URL.
   *
   * @param to Target URL, as wouter sees it (a path, plus search and hash when the link carries them)
   * @param options What the route change takes care of, see {@link ChangeRouteOptions}
   */
  function changeRoute(to: string, { commitUrl, scroll }: ChangeRouteOptions) {
    const target = routeManager.parseRouteFromUrl(pathOf(to))
    const current = selectRouteInfo(store.getState())
    const navigation = ++navigations

    // Nothing to load: an unknown route (which the routed outlet answers with its 404) or a
    // navigation that stays on the rendered route (hash- or search-only). Release the held view,
    // which belongs to a navigation that will never commit, and move the URL.
    if (!target || isSameRouteInfo(target, current)) {
      if (selectRouteTransitionInfo(store.getState()) !== null) {
        store.dispatch(changeRouteTransitionInfo(null))
      }
      commitUrl?.()
      if (scroll) {
        scrollToHash()
      }
      return
    }

    void (async () => {
      // Starts the content fetch (the hast listener reacts to it) and marks the transition as in
      // flight, which keeps the routed outlet on the current page until the swap below.
      store.dispatch(changeRouteTransitionInfo(target))
      await waitForRouteContentReady(store, routeManager, target)

      if (navigation !== navigations) {
        return // superseded: the newest navigation owns the URL, the commit and the transition state
      }

      const swap = () => {
        flushSync(() => {
          store.dispatch(changeRouteInfo(target)) // store swap
          store.dispatch(changeRouteTransitionInfo(null)) // state hygiene, in the same render
          commitUrl?.() // wouter swap
        })
      }

      // The snapshot is taken before the swap, so the crossfade always lands on a fully rendered page
      if (canAnimateSwap()) {
        document.startViewTransition(swap)
      } else {
        swap()
      }

      if (scroll) {
        scrollAfterNavigate()
      }
    })()
  }

  return {
    aroundNav: (navigate, to, options) => {
      changeRoute(to, {
        scroll: true,
        commitUrl: () => {
          navigate(to, options)
        },
      })
    },
    syncWithLocation: () => {
      const { pathname, search } = globalThis.location
      // The browser has already moved the address bar to the entry the reader chose, so the only thing
      // left behind is the route in the store - and there is no URL for the app to write.
      changeRoute(`${pathname}${search}`, { scroll: false })
    },
  }
}

export type { RouteNavigator }
export { makeRouteNavigator }
