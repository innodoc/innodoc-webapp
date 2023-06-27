import createCache, { type EmotionCache } from '@emotion/cache'
import type { i18n as I18nInstance } from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import type { SetupWorker } from 'msw'
import type { ComponentType } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'

import { EMOTION_STYLE_INSERTION_POINT_NAME, EMOTION_STYLE_KEY } from '#constants'
import makeStore, { type Store } from '#store/makeStore'
import { changeRouteTransitionInfo } from '#store/slices/appSlice'
import type { PageContextClient } from '#types/pageContext'
import PageShell from '#ui/components/PageShell/PageShell'
import RouteTransition from '#ui/components/PageShell/RouteTransition'
import getI18n from '#utils/getI18n'

const i18nBackendOpts = { loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json` }

// react-dom root
let root: Root

// root-dom node
let rootEl: HTMLElement

// Redux store
let store: Store

// i18n instance
let i18n: I18nInstance

// Emotion cache
let emotionCache: EmotionCache

// API mock
let mockWorker: SetupWorker

// Remember previous Page for route transition
let PagePrev: ComponentType

function createEmotionCache() {
  const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
    `meta[name="${EMOTION_STYLE_INSERTION_POINT_NAME}"]`
  )
  if (emotionInsertionPoint === null) {
    throw new Error('Could not find emotion insertion meta tag.')
  }
  return createCache({ key: EMOTION_STYLE_KEY, insertionPoint: emotionInsertionPoint })
}

function findRootElement() {
  if (rootEl === undefined) {
    const elem = document.getElementById('root')
    if (elem === null) {
      throw new Error('React root element not found!')
    }
    rootEl = elem
  }
}

async function render({ isHydration, Page, preloadedState, routeInfo }: PageContextClient) {
  findRootElement()

  if (routeInfo.locale === undefined) {
    throw new Error('locale undefined')
  }

  // Enable API mock
  // TODO: check that it doesn't get into production build
  if (import.meta.env.INNODOC_API_MOCK === 'true' && mockWorker === undefined) {
    const makeWorker = (await import('../../tests/mocks/browser')).default
    mockWorker = makeWorker(import.meta.env.INNODOC_APP_ROOT)
    await mockWorker.start({ onUnhandledRequest: 'bypass' })
  }

  if (store === undefined) {
    // Create store on first hydration
    store = makeStore(preloadedState)
  } else {
    // Initiate route transition on navigation
    store.dispatch(changeRouteTransitionInfo(routeInfo))
  }

  if (i18n === undefined) {
    // Create i18next instance
    i18n = await getI18n(
      I18NextHttpBackend,
      i18nBackendOpts,
      routeInfo.locale,
      routeInfo.courseSlug,
      store
    )
  }

  // Create Emotion cache
  if (emotionCache === undefined) {
    emotionCache = createEmotionCache()
  }

  const page = (
    <PageShell emotionCache={emotionCache} i18n={i18n} store={store}>
      <RouteTransition pagePrev={PagePrev ?? Page}>
        <Page />
      </RouteTransition>
    </PageShell>
  )

  // Hydration
  if (isHydration) {
    root = hydrateRoot(rootEl, page)
  }

  // Client-side user navigation
  else {
    root.render(page)
  }

  PagePrev = Page
}

export { render }
export const hydrationCanBeAborted = true // true for React
export const clientRouting = true
