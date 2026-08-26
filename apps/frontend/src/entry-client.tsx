import createCache from '@emotion/cache'
import { createStreamableHead, UnheadProvider } from '@unhead/react/stream/client'
import I18NextHttpBackend from 'i18next-http-backend'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import initI18n from '@innodoc/shared-core/i18n'
import { RouteManager } from '@innodoc/shared-core/routes'
import { isCourseSlugMode } from '@innodoc/shared-core/typeguards'
import makeStore from '@innodoc/shared-store'
import hastListenerMiddleware, { setupHastListeners } from '@innodoc/ui-content/hast-listener-middleware'
import App from './App.js'

async function makeProps() {
  if (!isCourseSlugMode(import.meta.env.INNODOC_COURSE_SLUG_MODE)) {
    throw new Error(`Invalid course slug mode: ${import.meta.env.INNODOC_COURSE_SLUG_MODE}`)
  }

  const routeManager = new RouteManager({
    config: {
      courseSlugMode: import.meta.env.INNODOC_COURSE_SLUG_MODE,
      defaultCourseSlug: import.meta.env.INNODOC_DEFAULT_COURSE_SLUG,
      pagePathPrefix: import.meta.env.INNODOC_PAGE_PATH_PREFIX,
      sectionPathPrefix: import.meta.env.INNODOC_SECTION_PATH_PREFIX,
    },
  })

  const emotionCache = createCache({ key: 'css' })
  const head = createStreamableHead()
  if (!head) {
    throw new Error('Expected head')
  }

  const { preloadedState, locale, supportedLocales } = globalThis.__initial_state__

  const i18NextHttpBackendOpts = { loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json` }
  // supportedLngs and fallbackLng mirror the server's i18n config so that
  // i18next's default 'dev' fallback is never loaded (which would cause a
  // spurious 404 request for a 'dev' locale file) and unknown languages fall
  // back to the app's default locale.
  const i18n = await initI18n([I18NextHttpBackend], {
    backend: i18NextHttpBackendOpts,
    debug: import.meta.env.DEV,
    fallbackLng: DEFAULT_LOCALES[0] ?? 'en',
    lng: locale,
    supportedLngs: supportedLocales,
  })

  const store = makeStore({
    devTools: import.meta.env.DEV,
    extraMiddlewares: [hastListenerMiddleware.middleware],
    preloadedState,
  })

  setupHastListeners(routeManager)

  return { emotionCache, head, i18n, routeManager, store }
}

const rootElement = document.querySelector('#root')
if (!rootElement) {
  throw new Error('Could not find root element #root')
}

const { head, ...appProps } = await makeProps()

hydrateRoot(
  rootElement,
  <StrictMode>
    <UnheadProvider value={head}>
      <App {...appProps} />
    </UnheadProvider>
  </StrictMode>,
)
