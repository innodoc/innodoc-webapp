import { isPromise } from 'node:util/types'

import type { Config, OnBeforeRenderAsync, PageContextServer } from 'vike/types'

import { isAppRouteInfo, isAppRouteName, isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import makeStore from '@innodoc/store'
import { changeRouteInfo } from '@innodoc/store/slices/app'
import { isCallable } from '@innodoc/typeguards/common'
import type { RouteParams } from '@innodoc/routes/types'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'
import type { AppRouteName } from '@innodoc/routes/types/routeNames'

import populateStore from './populateStore'

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

const onBeforeRender: OnBeforeRenderAsync = async function ({ routeInfo: routeInfoInput, routeParams, config }) {
  const routeInfo = mergeRouteInfo(routeInfoInput, routeParams)

  // Initialize store
  const store = makeStore()

  // Set current route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Populate store with necessary data
  if (isCourseRouteInfo(routeInfo)) {
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
    const ret = onInit({ routeInfo, store })
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
