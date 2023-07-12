import createCache, { type EmotionCache } from '@emotion/cache'
import type { PreloadedState } from '@reduxjs/toolkit'
import type { i18n as I18nInstance } from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { type ComponentType } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'

import { EMOTION_STYLE_INSERTION_POINT_NAME, EMOTION_STYLE_KEY } from '#constants'
import makeStore, { type RootState, type Store } from '#store/makeStore'
import { changeRouteTransitionInfo } from '#store/slices/appSlice'
import type { RouteInfo } from '#types/common'
import type { PageContextClient } from '#types/pageContext'
import PageShell from '#ui/components/app/PageShell/PageShell'
import RouteTransition from '#ui/components/app/RouteTransition'
import getI18n from '#utils/getI18n'

class ClientRenderer {
  /** react-dom root */
  private root: Root | undefined

  /** root-dom node */
  private rootEl: HTMLElement

  /** Redux store */
  private store: Store | undefined

  /** i18n instance */
  private i18n: I18nInstance | undefined

  /** Emotion cache */
  private emotionCache: EmotionCache | undefined

  /** API mock */
  private mockApiEnabled = false

  /** Remember previous Page for route transition */
  private PagePrev: ComponentType | undefined

  /** HTTP backend options */
  private readonly i18nBackendOpts = {
    loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
  }

  constructor() {
    this.rootEl = this.findRootElement()
  }

  /** Initialize client rendering */
  private async init(preloadedState: PreloadedState<RootState>, routeInfo: RouteInfo) {
    await this.enableMockApi()
    this.store = makeStore(preloadedState)
    this.i18n = await getI18n(
      I18NextHttpBackend,
      this.i18nBackendOpts,
      routeInfo.locale,
      routeInfo.courseSlug,
      this.store
    )
    this.emotionCache = this.createEmotionCache()
  }

  /** Hydrate page or handle navigation */
  async render({ isHydration, Page, preloadedState, routeInfo }: PageContextClient) {
    if (routeInfo.locale === undefined) {
      throw new Error('locale undefined')
    }

    if (isHydration) {
      // Initialize on client hydration
      await this.init(preloadedState, routeInfo)
    } else {
      // Initiate route transition on navigation
      this.store?.dispatch(changeRouteTransitionInfo(routeInfo))
    }

    // Sanity checks
    if (this.emotionCache === undefined || this.store === undefined || this.i18n === undefined) {
      throw new Error('init was not called')
    }

    // Create root app node
    const rootAppNode = (
      <PageShell emotionCache={this.emotionCache} i18n={this.i18n} store={this.store}>
        <RouteTransition pagePrev={this.PagePrev ?? Page}>
          <Page />
        </RouteTransition>
      </PageShell>
    )

    // Hydration
    if (isHydration) {
      this.root = hydrateRoot(this.rootEl, rootAppNode)
    }

    // Client-side navigation
    else {
      this.root?.render(rootAppNode)
    }

    // Remember page component for next route transition
    this.PagePrev = Page
  }

  /** Enable Mock API */
  private async enableMockApi() {
    // Stripped in production build
    if (import.meta.env.DEV) {
      if (import.meta.env.INNODOC_API_MOCK === 'true' && !this.mockApiEnabled) {
        const makeWorker = (await import('../../../tests/mocks/browser')).default
        const worker = makeWorker(import.meta.env.INNODOC_APP_ROOT)
        await worker.start({ onUnhandledRequest: 'bypass' })
        this.mockApiEnabled = true
      }
    }
  }

  /** Determine React root element */
  private findRootElement() {
    const elem = document.getElementById('root')
    if (elem === null) {
      throw new Error('React root element not found!')
    }
    return elem
  }

  /** Create emotion style cache */
  private createEmotionCache() {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      `meta[name="${EMOTION_STYLE_INSERTION_POINT_NAME}"]`
    )
    if (emotionInsertionPoint === null) {
      throw new Error('Could not find emotion insertion meta tag.')
    }
    return createCache({ key: EMOTION_STYLE_KEY, insertionPoint: emotionInsertionPoint })
  }
}

export default ClientRenderer
