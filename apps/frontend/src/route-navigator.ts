import type { AroundNavHandler } from 'wouter'
import { flushSync } from 'react-dom'
import { resolveDocumentLocale, uiLocales } from '@innodoc/shared-core/document-locale'
import type { RouteManager } from '@innodoc/shared-core/routes'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiCourse, FrontendRouteInfo } from '@innodoc/shared-core/types'
import {
  changeRouteInfo,
  changeRouteTransitionInfo,
  selectRouteInfo,
  selectRouteTransitionInfo,
} from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import { selectCourseLocales } from '@innodoc/shared-store/slices/content/selectors/courses'
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
 *   already moved by the time this runs, so the pipeline must not write the URL again - except
 *   when the entry names a URL the app corrects (a course locale the course does not serve): the
 *   dead entry is rewritten in place, never pushed.
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
 *
 * Both arguments must carry the document locale (see {@link withDocumentLocale}): the store holds
 * the normalised locale, so comparing a raw URL locale against it would miss same-route
 * navigations on pages whose URL locale has no UI bundle.
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

/**
 * The search and hash of a wouter `to`, kept for a rewritten path: a correction moves the route,
 * not the parameters the reader travelled with
 */
function suffixOf(to: string): string {
  const [withoutHash = ''] = to.split('#')
  const hash = to.slice(withoutHash.length)
  const [withoutSearch = ''] = withoutHash.split('?')
  const search = withoutHash.slice(withoutSearch.length)
  return search + hash
}

/**
 * The route info the store keeps after a navigation.
 *
 * The store holds the document locale - the URL locale as long as the UI can render it, the default
 * otherwise - mirroring the resolution the request handler applies on SSR. That is what keeps
 * `<html lang>`, the language switcher and the i18next this store feeds all on the language the
 * document is rendered in. Read at swap time, which is client-only: this module is imported during
 * SSR as well, where no `__initial_state__` exists yet. The route the content is fetched for keeps
 * the URL's own locale - the transition dispatch upstream of the swap still carries it.
 */
function withDocumentLocale(target: FrontendRouteInfo): FrontendRouteInfo {
  const { supportedLocales } = globalThis.__initial_state__
  return { ...target, locale: resolveDocumentLocale(target.locale, uiLocales(supportedLocales)) }
}

/** Shape of the RTK Query result the course record wait reads */
interface CourseQueryResult {
  isError: boolean
  data?: ApiCourse
}

/**
 * Whether a course query counts as settled for the wait: an error means the record will not
 * arrive, a fulfilled query additionally needs its data
 */
function isCourseQuerySettled(query: CourseQueryResult): boolean {
  return query.isError || query.data !== undefined
}

/**
 * Make sure the course record the locale correction reads is in the cache.
 *
 * Nothing else on the client fetches course records, so this starts the `getCourse` fetch and
 * waits for it to settle - like the content readiness wait, an errored fetch counts as settled,
 * and a timeout resolves anyway: an unresolvable course must not hold a navigation hostage. The
 * caller re-reads the record after settling and corrects nothing when the fetch delivered none.
 * A record already cached as an error is read as-is, so a navigation to a dead URL cannot turn
 * the correction into a refetch storm.
 */
function waitForCourseRecord(store: Store, routeManager: RouteManager, courseSlug: string): Promise<void> {
  const coursesApi = getCoursesApi(routeManager)
  // Not memoised by RTK Query, so it is prepared once per wait - never inside the subscription
  // callback, where it would repeat for every dispatched action
  const selectCourse = coursesApi.endpoints.getCourse.select({ courseSlug })

  if (isCourseQuerySettled(selectCourse(store.getState()))) {
    return Promise.resolve()
  }

  void store.dispatch(coursesApi.endpoints.getCourse.initiate({ courseSlug }))

  return new Promise<void>((resolve) => {
    let settled = false

    const settle = () => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      unsubscribe()
      resolve()
    }

    const unsubscribe = store.subscribe(() => {
      if (isCourseQuerySettled(selectCourse(store.getState()))) {
        settle()
      }
    })

    const timer = setTimeout(settle, 10_000)
  })
}

/**
 * The target route with a course locale the course does not serve corrected to the course's first
 * locale - the same canonical target the SSR redirect produces (populate-store.ts answers a full
 * load of an unoffered locale with a 302 to `course.locales[0]`). Applied before anything else
 * in the pipeline, so the identity check, the content fetch and the commit all work on the route
 * the redirect would have produced.
 *
 * Returns the target unchanged (same reference) when it is not a course route or the locale is
 * offered.
 *
 * The correction reads the course record from the cache, and a navigation can name a course the
 * session has never loaded: while the record is not cached, it is fetched here before the
 * correction decides. An unresolvable course must not hold the navigation hostage: the fetch
 * settles on an error (and on timeout) as well, after which the correction finds no locales and
 * returns the target unchanged - the navigation proceeds uncorrected, and the content fetch
 * answers it (with an error for a locale the course does not offer) exactly as it did before the
 * course was fetched here.
 */
async function withOfferedCourseLocale(
  routeManager: RouteManager,
  store: Store,
  target: FrontendRouteInfo,
): Promise<FrontendRouteInfo> {
  if (!isCourseRouteInfo(target)) {
    return target
  }

  if (selectCourseLocales(routeManager, store.getState(), target.courseSlug) === undefined) {
    await waitForCourseRecord(store, routeManager, target.courseSlug)
  }

  const locales = selectCourseLocales(routeManager, store.getState(), target.courseSlug)
  if (locales === undefined || locales.includes(target.locale)) {
    return target
  }

  // A course that declares no locale cannot serve one: SSR would redirect to a broken URL, so
  // here the navigation is left uncorrected instead
  const firstLocale = locales[0]
  if (firstLocale === undefined) {
    return target
  }

  return { ...target, locale: firstLocale }
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
   * Moves the URL to the committed route, in the same synchronous swap as the store.
   *
   * `to` is the URL to commit - the canonical one when the reader asked for a course locale the
   * course does not serve, which the SSR redirect would have corrected. `replace` is true then: a
   * `replaceState` commit, so the URL the reader asked for never enters the history, and the
   * entry that already names it is rewritten in place.
   *
   * Absent when the URL is already where the reader asked to be and needs no correction, which is
   * the case for a history navigation: writing it again would push a new entry, turning one back
   * press into a step forward nobody asked for.
   */
  commitUrl?: (to: string, replace: boolean) => void

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
    // Claim the navigation's place in line before anything async runs: the supersede check below
    // compares these numbers, and a navigation that awaits (an uncached course) must not claim its
    // number after a newer one has
    const navigation = ++navigations

    void (async () => {
      const state = store.getState()
      const parsed = routeManager.parseRouteFromUrl(pathOf(to))
      // A course is served in the locales it declares: correct an unoffered one before anything
      // else, so the identity check, the content fetch and the commit all work on the route the SSR
      // redirect would have produced. The correction reads the course record from the cache, so an
      // uncached course is fetched first
      const target = parsed === null ? null : await withOfferedCourseLocale(routeManager, store, parsed)
      const corrected = target !== null && target !== parsed
      const url = corrected ? routeManager.generateFrontendUrlPath({ ...target }) + suffixOf(to) : to
      const current = selectRouteInfo(state)

      // Nothing to load: an unknown route (which the routed outlet answers with its 404) or a
      // navigation that stays on the rendered route (hash- or search-only). The target is normalised
      // the same way the store is, so a hash-only navigation on a page whose URL locale has no UI
      // bundle still hits this fast path. Release the held view, which belongs to a navigation that
      // will never commit, and move the URL.
      if (!target || isSameRouteInfo(withDocumentLocale(target), current)) {
        if (selectRouteTransitionInfo(store.getState()) !== null) {
          store.dispatch(changeRouteTransitionInfo(null))
        }
        commitUrl?.(url, corrected)
        if (scroll) {
          scrollToHash()
        }
        return
      }

      // A navigation superseded while awaiting (an uncached course) must not mark its abandoned
      // target as in flight: it would hold the routed outlet on the current page and fetch that
      // target's content until the newest navigation clears the state. The check after the content
      // wait covers a supersede that happens while waiting for it.
      if (navigation !== navigations) {
        return // superseded: the newest navigation owns the URL, the commit and the transition state
      }

      // Starts the content fetch (the hast listener reacts to it) and marks the transition as in
      // flight, which keeps the routed outlet on the current page until the swap below.
      store.dispatch(changeRouteTransitionInfo(target))
      await waitForRouteContentReady(store, routeManager, target)

      if (navigation !== navigations) {
        return // superseded while waiting for the content: the newest navigation owns the URL, the commit and the transition state
      }

      const swap = () => {
        flushSync(() => {
          store.dispatch(changeRouteInfo(withDocumentLocale(target))) // store swap
          store.dispatch(changeRouteTransitionInfo(null)) // state hygiene, in the same render
          commitUrl?.(url, corrected) // wouter swap
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
        commitUrl: (url, replace) => {
          navigate(url, replace ? { ...options, replace: true } : options)
        },
      })
    },
    syncWithLocation: () => {
      const { pathname, search } = globalThis.location
      // The browser has already moved the address bar to the entry the reader chose, so the only
      // thing left behind is the route in the store - and there is no URL for the app to write:
      // writing it as a new entry would turn one back press into a step forward nobody asked for.
      // The one exception is a corrected target: the entry names a URL the course does not serve,
      // and rewriting it in place is what keeps the next back press from stranding on the dead URL.
      changeRoute(`${pathname}${search}`, {
        scroll: false,
        commitUrl: (url, replace) => {
          if (replace) {
            globalThis.history.replaceState(null, '', url)
          }
        },
      })
    },
  }
}

export type { RouteNavigator }
export { makeRouteNavigator }
