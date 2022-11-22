import createCache, { type EmotionCache } from '@emotion/cache'
import type { i18n as I18nInstance } from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { hydrateRoot, type Root } from 'react-dom/client'

import makeStore, { type Store } from '#store/makeStore'
import { changeUrlWithoutLocale } from '#store/slices/uiSlice'
import type { PageContextClient } from '#types/page'
import PageShell from '#ui/components/PageShell/PageShell'
import getI18n from '#utils/getI18n'

const i18nBackendOpts = { loadPath: import.meta.env.BASE_URL + 'locales/{{lng}}/{{ns}}.json' }

// ReactDom root
let root: Root

// root DOM node
let rootEl: HTMLElement

// Redux store
let store: Store

// i18n instance
let i18n: I18nInstance

// Emotion cache
let emotionCache: EmotionCache

function createEmotionCache() {
  const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
    'meta[name="emotion-insertion-point"]'
  )
  if (emotionInsertionPoint === null) {
    throw new Error('Could not find emotion insertion meta tag.')
  }
  return createCache({ key: 'emotion-style', insertionPoint: emotionInsertionPoint })
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

async function render({
  isHydration,
  locale,
  Page,
  pageProps,
  preloadedState,
  urlPathname,
}: PageContextClient) {
  findRootElement()

  if (store === undefined) {
    // Create store on first hydration
    store = makeStore(preloadedState)
  } else {
    // Update store on navigation
    store.dispatch(changeUrlWithoutLocale(urlPathname))
  }

  // Get i18next instance
  if (i18n === undefined) {
    i18n = await getI18n(I18NextHttpBackend, i18nBackendOpts, locale, store)
  }

  // Create Emotion cache
  if (emotionCache === undefined) {
    emotionCache = createEmotionCache()
  }

  const page = (
    <PageShell emotionCache={emotionCache} i18n={i18n} store={store}>
      <Page {...pageProps} />
    </PageShell>
  )

  if (isHydration) {
    root = hydrateRoot(rootEl, page)
  } else {
    // Client-side user navigation
    root.render(page)
  }

  // TODO: scoll to URL hash if present
}

export { render }
export const hydrationCanBeAborted = true // true for React
export const clientRouting = true
