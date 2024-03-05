import { isPromise } from 'util/types'
import type { Config, OnBeforeRenderAsync } from 'vike/types'

import makeStore from '@innodoc/store'
import { changeRouteInfo } from '@innodoc/store/slices/app'
import { isCallable } from '@innodoc/utils/typeGuards'

import populateStore from './populateStore'

const onBeforeRender: OnBeforeRenderAsync = async function ({
  routeInfo: routeInfoInput,
  routeParams,
  urlOriginal,
  config,
}) {
  // Merge data extracted in route function
  const routeInfo = { ...routeInfoInput, ...routeParams }

  // Initialize store
  const store = makeStore()

  // Set current route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Populate store with necessary data
  if (routeInfo.courseSlug !== null) {
    await populateStore(store, routeInfo)
  }

  // TODO: how to handle this correctly?
  if (urlOriginal === '/fake-404-url') {
    routeInfo.locale = 'en'
  }

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
