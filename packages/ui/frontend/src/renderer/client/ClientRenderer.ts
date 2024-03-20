import createCache, { type EmotionCache } from '@emotion/cache'
import I18NextHttpBackend from 'i18next-http-backend'
import { hydrateRoot, type Root } from 'react-dom/client'
import type { i18n as I18nInstance } from 'i18next'
import type { ComponentType } from 'react'
import type { PageContextClient } from 'vike/types'

import renderPage from '@innodoc/components/renderPage'
import { EMOTION_STYLE_INSERTION_POINT_NAME, EMOTION_STYLE_KEY } from '@innodoc/constants'
import getI18n from '@innodoc/i18n'
import makeStore from '@innodoc/store'
import { changeRouteTransitionInfo } from '@innodoc/store/slices/app'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'
import type { RootState, Store } from '@innodoc/store/types'

import { getSupportedLocales } from '#renderer/common'

class ClientRenderer {
  /** react-dom root */
  private root: Root | undefined

  /** root-dom node */
  private rootEl: Element

  /** Redux store */
  private store: Store | undefined

  /** i18n instance */
  private i18n: I18nInstance | undefined

  /** Emotion cache */
  private emotionCache: EmotionCache | undefined

  /** API mock */
  // private mockApiEnabled = false

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
  private async init(preloadedState: RootState, routeInfo: AppRouteInfo) {
    // await this.enableMockApi()
    this.store = makeStore(preloadedState)

    const locales = getSupportedLocales(this.store, routeInfo)

    this.i18n = await getI18n(I18NextHttpBackend, this.i18nBackendOpts, routeInfo.locale, locales)
    this.emotionCache = this.createEmotionCache()
  }

  /** Hydrate page or handle navigation */
  async render(pageContext: PageContextClient) {
    const { isHydration, Page, preloadedState, routeInfo } = pageContext

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
    if (Page === undefined) {
      throw new Error('Page component missing')
    }

    // Create root app node
    const rootAppNode = renderPage(
      pageContext,
      Page,
      this.emotionCache,
      this.i18n,
      this.store,
      undefined,
      this.PagePrev ?? Page,
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

  /** FIXME: Enable Mock API */
  // private async enableMockApi() {
  //   // Stripped in production build
  //   if (import.meta.env.DEV) {
  //     if (import.meta.env.INNODOC_API_MOCK === 'true' && !this.mockApiEnabled) {
  //       const makeWorker = (await import('../../../tests/mocks/browser')).default
  //       const worker = makeWorker(import.meta.env.INNODOC_APP_ROOT)
  //       await worker.start({ onUnhandledRequest: 'bypass' })
  //       this.mockApiEnabled = true
  //     }
  //   }
  // }

  /** Determine React root element */
  private findRootElement() {
    const elem = document.querySelector('#root')
    if (elem === null) {
      throw new Error('React root element not found!')
    }
    return elem
  }

  /** Create emotion style cache */
  private createEmotionCache() {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      `meta[name="${EMOTION_STYLE_INSERTION_POINT_NAME}"]`,
    )
    if (emotionInsertionPoint === null) {
      throw new Error('Could not find emotion insertion meta tag.')
    }
    return createCache({ key: EMOTION_STYLE_KEY, insertionPoint: emotionInsertionPoint })
  }
}

export default ClientRenderer
