import { isPromise } from 'node:util/types'

import type { Config, OnBeforeRenderAsync, PageContextServer } from 'vike/types'

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

const onBeforeRender: OnBeforeRenderAsync = async function ({
  isClientSideNavigation,
  routeInfo: routeInfoInput,
  routeParams,
  config,
}) {
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
  const { onInit } = config as Config // TODO: once vikejs/vike#1532 is released
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
