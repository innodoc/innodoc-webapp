import { isPromise } from 'node:util/types'

import type { PageContextServer } from 'vike/types'

import { isAppRouteInfo, isAppRouteName, isCallable, isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import makeStore from '@innodoc/ui-store'
import { changeRouteInfo } from '@innodoc/ui-store/slices/app'
import type { AppRouteInfo, AppRouteName, RouteParams } from '@innodoc/shared-core/types'

import populateStore from './populate-store.js'

function isRouteParams<R extends AppRouteName>(params: PageContextServer['routeParams']): params is RouteParams<R> {
  return isAppRouteName(params.name)
}

/**
 * Merge extracted route parameters from route function into `routeInfo`.
 *
 * @param routeInfo input `routeInfo` object
 * @param params extracted info from route function
 * @returns merged `routeInfo`
 */
function mergeRouteInfo(routeInfo: AppRouteInfo, params: PageContextServer['routeParams']) {
  if (isRouteParams(params)) {
    const mergedRouteInfo = { ...routeInfo, ...params }
    if (isAppRouteInfo(mergedRouteInfo)) {
      return mergedRouteInfo
    }
  }
  return routeInfo
}

async function onBeforeRender({
  isClientSideNavigation,
  routeInfo: routeInfoInput,
  routeParams,
  config: { onInit },
}: PageContextServer) {
  const routeInfo = mergeRouteInfo(routeInfoInput, routeParams)

  // Initialize store
  const store = makeStore()

  // Set current route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Populate store with necessary data
  if (!isClientSideNavigation && isCourseRouteInfo(routeInfo)) {
    await populateStore(store, routeInfo)
  }

  // TODO: how to handle this correctly?
  // TODO: still needed?
  // if (urlOriginal === '/fake-404-url') {
  //   routeInfo.locale = 'en'
  // }

  // onInit hook
  if (isCallable(onInit)) {
    const ret = onInit({ isClientSideNavigation, routeInfo, store })
    if (isPromise(ret)) {
      await ret
    }
  }

  return {
    pageContext: {
      routeInfo,
      store,
      preloadedState: store.getState(),
    },
  }
}

export default onBeforeRender
