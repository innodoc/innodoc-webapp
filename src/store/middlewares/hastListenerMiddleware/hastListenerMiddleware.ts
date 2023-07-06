import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit'

import type { AppListenerEffectAPI, AppStartListening } from '#store/middlewares/types'
import { changeRouteTransitionInfo } from '#store/slices/appSlice'
import { addHastResult, changeIsProcessing, selectHastResultByHash } from '#store/slices/hastSlice'
import type { ContentWithHash, RouteInfo } from '#types/common'
import { isHastResultWithHash } from '#types/typeGuards'
import fetchContent from '#utils/fetchContent'

interface PageRouteInfo extends RouteInfo {
  routeName: 'app:page'
}

interface SectionRouteInfo extends RouteInfo {
  routeName: 'app:section'
}

const hastListenerMiddleware = createListenerMiddleware()

// Client-only, on server this happens in onBeforeRender hook
if (!import.meta.env.SSR) {
  const startListening = hastListenerMiddleware.startListening as AppStartListening

  // Markdown->hast worker
  const worker = new Worker(new URL('./markdownToHastWorker.ts', import.meta.url), {
    name: 'markdown-worker',
    type: 'module',
  })

  // Process Markdown->hast in web worker
  async function processMarkdown(content: ContentWithHash, listenerApi: AppListenerEffectAPI) {
    // Cache miss?
    if (selectHastResultByHash(listenerApi.getState(), content.hash) === undefined) {
      listenerApi.dispatch(changeIsProcessing(true))

      // Process Markdown->hast in web worker
      function workerListener({ data: result }: MessageEvent) {
        if (isHastResultWithHash(result) && result.hash === content.hash) {
          listenerApi.dispatch(addHastResult(result))
        }
      }

      // Send job to worker
      try {
        worker.addEventListener('message', workerListener)
        worker.postMessage(content)
        await listenerApi.take(
          (action) => addHastResult.match(action) && action.payload.hash === content.hash
        )
      } finally {
        worker.removeEventListener('message', workerListener)
        listenerApi.dispatch(changeIsProcessing(false))
      }
    }
  }

  // Page route transition effect
  async function pageRouteTransitionEffect(
    { payload: { courseSlug, locale, pageSlug } }: PayloadAction<PageRouteInfo>,
    listenerApi: AppListenerEffectAPI
  ) {
    if (courseSlug !== null && pageSlug !== undefined) {
      const result = await fetchContent('page', courseSlug, locale, pageSlug, listenerApi.dispatch)
      if (result.isSuccess && result.data !== undefined) {
        await processMarkdown(result.data, listenerApi)
      }
    }
  }

  // Section route transition effect
  async function sectionRouteTransitionEffect(
    { payload: { courseSlug, locale, sectionPath } }: PayloadAction<SectionRouteInfo>,
    listenerApi: AppListenerEffectAPI
  ) {
    if (courseSlug !== null && sectionPath !== undefined) {
      const result = await fetchContent(
        'section',
        courseSlug,
        locale,
        sectionPath,
        listenerApi.dispatch
      )
      if (result.isSuccess && result.data !== undefined) {
        await processMarkdown(result.data, listenerApi)
      }
    }
  }

  // Add page route transition listener
  startListening({
    matcher: (action: AnyAction): action is PayloadAction<PageRouteInfo> =>
      changeRouteTransitionInfo.match(action) && action.payload?.routeName === 'app:page',
    effect: pageRouteTransitionEffect,
  })

  // Add section route transition listener
  startListening({
    matcher: (action: AnyAction): action is PayloadAction<SectionRouteInfo> =>
      changeRouteTransitionInfo.match(action) && action.payload?.routeName === 'app:section',
    effect: sectionRouteTransitionEffect,
  })
}

export default hastListenerMiddleware
