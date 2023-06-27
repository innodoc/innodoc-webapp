import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '#store/makeStore'
import type { AppListenerEffectAPI, AppStartListening } from '#store/middlewares/types'
import { changeRouteTransitionInfo } from '#store/slices/appSlice'
import { addHastRoot, changeIsProcessing, selectHast } from '#store/slices/hastSlice'
import type { ContentWithHash, WithContentHash, RouteInfo } from '#types/common'
import { isHastRootWithHash, isWithContentHash } from '#types/typeGuards'
import fetchContent from '#utils/fetchContent'

interface PageRouteInfo extends RouteInfo {
  routeName: 'app:page'
}

interface SectionRouteInfo extends RouteInfo {
  routeName: 'app:section'
}

interface WorkerErrorResponse extends WithContentHash {
  /** Error message */
  error: string
}

const hastListenerMiddleware = createListenerMiddleware()

// Client-only, on server this happens in onBeforeRender hook
if (!import.meta.env.SSR) {
  const startListening = hastListenerMiddleware.startListening as AppStartListening
  const selectHastRootByHash = (state: RootState, hash: string) => selectHast(state).content[hash]

  function isWorkerErrorResponse(obj: unknown): obj is WorkerErrorResponse {
    return isWithContentHash(obj) && typeof (obj as WorkerErrorResponse).error === 'string'
  }

  // Markdown->hast worker
  const worker = new Worker(new URL('./markdownToHastWorker.ts', import.meta.url), {
    name: 'markdown-worker',
    type: 'module',
  })

  // Process Markdown->hast in web worker
  async function processMarkdown(content: ContentWithHash, listenerApi: AppListenerEffectAPI) {
    // Cache miss?
    if (selectHastRootByHash(listenerApi.getState(), content.hash) === undefined) {
      listenerApi.dispatch(changeIsProcessing(true))

      // Process Markdown->hast in web worker
      function workerListener({ data: response }: MessageEvent) {
        if (isHastRootWithHash(response) && response.hash === content.hash) {
          listenerApi.dispatch(addHastRoot(response))
        } else if (isWorkerErrorResponse(response) && response.hash === content.hash) {
          // TODO handle error
          console.error(new Error(response.error))
        }
      }

      try {
        worker.addEventListener('message', workerListener)
        worker.postMessage(content)
        await listenerApi.take(
          (action) => addHastRoot.match(action) && action.payload.hash === content.hash
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
