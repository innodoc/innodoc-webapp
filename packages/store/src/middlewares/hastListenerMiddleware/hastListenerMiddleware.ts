import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { PayloadAction, UnknownAction } from '@reduxjs/toolkit'

import { isHastRootDivElement } from '@innodoc/markdown/typeGuards'
import { isParserError, isWithContentHash } from '@innodoc/utils/typeGuards'
import type { CourseContentRouteInfo } from '@innodoc/routes/types/routeInfos'
import type { ContentWithHash, HastResultWithHash } from '@innodoc/types/common'

import { changeRouteTransitionInfo } from '#slices/app'
import { addHastResult, changeIsProcessing, selectHastResultByHash } from '#slices/hast'
import { fetchContent } from '#utils'
import type { AppListenerEffectAPI, AppStartListening } from '#types'

/** Type guard for `HastResultWithHash` */
function isHastResultWithHash(obj: unknown): obj is HastResultWithHash {
  const result = obj as HastResultWithHash
  return (
    isWithContentHash(obj) && (isHastRootDivElement(result.root) || isParserError(result.error))
  )
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
  const processMarkdown = async (content: ContentWithHash, listenerApi: AppListenerEffectAPI) => {
    // Cache miss?
    if (!selectHastResultByHash(listenerApi.getState(), content.hash)) {
      listenerApi.dispatch(changeIsProcessing(true))

      // Process Markdown->hast in web worker
      const workerListener = ({ data: result }: MessageEvent) => {
        if (isHastResultWithHash(result) && result.hash === content.hash) {
          listenerApi.dispatch(addHastResult(result))
        }
      }

      // Send job to worker
      try {
        worker.addEventListener('message', workerListener)
        worker.postMessage(content)
        await listenerApi.take(
          (action) => addHastResult.match(action) && action.payload.hash === content.hash,
        )
      } finally {
        worker.removeEventListener('message', workerListener)
        listenerApi.dispatch(changeIsProcessing(false))
      }
    }
  }

  // Page route transition effect
  const pageRouteTransitionEffect = async (
    {
      payload: { courseSlug, locale, pageSlug },
    }: PayloadAction<CourseContentRouteInfo<'app:course:page'>>,
    listenerApi: AppListenerEffectAPI,
  ) => {
    if (pageSlug) {
      const result = await fetchContent('page', courseSlug, locale, pageSlug, listenerApi.dispatch)
      if (result.isSuccess) {
        await processMarkdown(result.data, listenerApi)
      }
    }
  }

  // Section route transition effect
  const sectionRouteTransitionEffect = async (
    {
      payload: { courseSlug, locale, sectionPath },
    }: PayloadAction<CourseContentRouteInfo<'app:course:section'>>,
    listenerApi: AppListenerEffectAPI,
  ) => {
    const result = await fetchContent(
      'section',
      courseSlug,
      locale,
      sectionPath,
      listenerApi.dispatch,
    )
    if (result.isSuccess) {
      await processMarkdown(result.data, listenerApi)
    }
  }

  // Add page route transition listener
  startListening({
    matcher: (
      action: UnknownAction,
    ): action is PayloadAction<CourseContentRouteInfo<'app:course:page'>> =>
      changeRouteTransitionInfo.match(action) && action.payload?.name === 'app:course:page',
    effect: pageRouteTransitionEffect,
  })

  // Add section route transition listener
  startListening({
    matcher: (
      action: UnknownAction,
    ): action is PayloadAction<CourseContentRouteInfo<'app:course:section'>> =>
      changeRouteTransitionInfo.match(action) && action.payload?.name === 'app:course:section',
    effect: sectionRouteTransitionEffect,
  })
}

export { isHastResultWithHash }
export default hastListenerMiddleware
