import type { RouteManager } from '@innodoc/shared-core/routes'
import { isCoursePageRouteInfo, isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
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

/**
 * Whether content for `routeInfo` is available in the store.
 *
 * Content routes require the RTK Query cache to be settled (fulfilled or error)
 * and, for fulfilled queries, the hast result to be present. Error states count
 * as ready so that the page's error UI can render instead of blocking.
 * Non-content routes are always ready.
 */
function isRouteContentReady(routeManager: RouteManager, state: RootState, routeInfo: FrontendRouteInfo): boolean {
  if (isCoursePageRouteInfo(routeInfo)) {
    const query = getPagesApi(routeManager).endpoints.getPageContent.select({
      courseSlug: routeInfo.courseSlug,
      locale: routeInfo.locale,
      pageSlug: routeInfo.pageSlug,
    })(state)

    if (query.isError) {
      return true
    }
    if (!query.isSuccess) {
      return false
    }
    return selectHastResultByHash(state, query.data.hash) !== undefined
  }

  if (isCourseSectionRouteInfo(routeInfo)) {
    const query = getSectionsApi(routeManager).endpoints.getSectionContent.select({
      courseSlug: routeInfo.courseSlug,
      locale: routeInfo.locale,
      sectionPath: routeInfo.sectionPath,
    })(state)

    if (query.isError) {
      return true
    }
    if (!query.isSuccess) {
      return false
    }
    return selectHastResultByHash(state, query.data.hash) !== undefined
  }

  // Non-content routes (index, toc, progress, login, ...) are immediately ready
  return true
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
  // Already ready?
  if (isRouteContentReady(routeManager, store.getState(), routeInfo)) {
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
      if (isRouteContentReady(routeManager, store.getState(), routeInfo)) {
        settle()
      }
    })

    const timer = setTimeout(settle, timeoutMs)
  })
}

export type { WaitForRouteContentReadyOptions }
export { waitForRouteContentReady }
