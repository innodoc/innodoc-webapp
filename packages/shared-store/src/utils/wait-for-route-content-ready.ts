import type { RouteManager } from '@innodoc/shared-core/routes'
import { isCoursePageRouteInfo, isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ContentWithHash, FrontendRouteInfo } from '@innodoc/shared-core/types'
import getPagesApi from '#slices/content/pages'
import getSectionsApi from '#slices/content/sections'
import { selectHastResultByHash } from '#slices/hast'
import type { RootState, Store } from '#types'

interface WaitForRouteContentReadyOptions {
  /**
   * Maximum time in milliseconds to wait for content before resolving anyway.
   * Never blocks navigation indefinitely; on failure the page's own
   * `isError`/`isLoading` UI takes over.
   *
   * @default 10000
   */
  timeoutMs?: number
}

/** Shape of the RTK Query result the content readiness check reads */
interface ContentQueryResult {
  isError: boolean
  isSuccess: boolean
  data?: ContentWithHash
}

/**
 * Whether a settled content query counts as ready: errors are ready (the page's error UI can
 * render instead of blocking); fulfilled queries additionally need their hast result.
 */
function isQueryReady(state: RootState, query: ContentQueryResult): boolean {
  if (query.isError) {
    return true
  }
  if (!query.isSuccess) {
    return false
  }
  // Direct lookup, deliberately not memoised
  return query.data !== undefined && selectHastResultByHash(state, query.data.hash) !== undefined
}

/**
 * Prepare the RTK Query selector for the content query of `routeInfo`, or `undefined` for
 * non-content routes (index, toc, progress, login, ...), which are immediately ready.
 *
 * `endpoint.select(args)` is not memoised by RTK Query (it builds a fresh selector and
 * serialises the args on every call), so this runs **once per wait** - never inside the
 * subscription callback where it would repeat for every dispatched action.
 */
function selectRouteContentQuery(
  routeManager: RouteManager,
  routeInfo: FrontendRouteInfo,
): ((state: RootState) => ContentQueryResult) | undefined {
  if (isCoursePageRouteInfo(routeInfo)) {
    return getPagesApi(routeManager).endpoints.getPageContent.select({
      courseSlug: routeInfo.courseSlug,
      locale: routeInfo.locale,
      pageSlug: routeInfo.pageSlug,
    })
  }

  if (isCourseSectionRouteInfo(routeInfo)) {
    return getSectionsApi(routeManager).endpoints.getSectionContent.select({
      courseSlug: routeInfo.courseSlug,
      locale: routeInfo.locale,
      sectionPath: routeInfo.sectionPath,
    })
  }

  return undefined
}

/**
 * Resolves when content for `routeInfo` is available in the store
 * (RTK Query cache fulfilled AND hast result present), or on timeout.
 * Non-content routes resolve immediately.
 */
function waitForRouteContentReady(
  store: Store,
  routeManager: RouteManager,
  routeInfo: FrontendRouteInfo,
  { timeoutMs = 10_000 }: WaitForRouteContentReadyOptions = {},
): Promise<void> {
  const selectQuery = selectRouteContentQuery(routeManager, routeInfo)

  // Already ready, or a non-content route?
  if (selectQuery === undefined || isQueryReady(store.getState(), selectQuery(store.getState()))) {
    return Promise.resolve()
  }

  // Otherwise, wait for a state change that makes it ready, or time out
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
      if (isQueryReady(store.getState(), selectQuery(store.getState()))) {
        settle()
      }
    })

    const timer = setTimeout(settle, timeoutMs)
  })
}

export type { WaitForRouteContentReadyOptions }
export { waitForRouteContentReady }
