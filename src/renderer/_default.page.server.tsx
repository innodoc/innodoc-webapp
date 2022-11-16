import path from 'path'
import { fileURLToPath } from 'url'

import _createCache from '@emotion/cache'
import _createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material/styles/index.js'
import I18NextFsBackend from 'i18next-fs-backend'
import { renderToStaticMarkup } from 'react-dom/server'
import type { FilledContext } from 'react-helmet-async'
import { escapeInject, dangerouslySkipEscape, RenderErrorPage } from 'vite-plugin-ssr'

// Material UI font
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'

// KaTeX CSS
import 'katex/dist/katex.min.css'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import makeStore from '@/store/makeStore'
import { selectHomeLink, selectLocales } from '@/store/selectors/content/course'
import contentApi from '@/store/slices/contentApi'
import { changeLocale, changeUrlWithoutLocale } from '@/store/slices/uiSlice'
import type { PageContextServer, PrepopFactory } from '@/types/page'
import PageShell from '@/ui/components/PageShell/PageShell'
import { replacePathPrefixes } from '@/utils/content'
import getI18n from '@/utils/getI18n'
import { formatUrl } from '@/utils/url'

import fetchContent from './fetchContent'
import renderToHtml from './renderToHtml'

// Workaround to make compatible with Node ESM and vite loaders
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const createCache = ((_createCache as any).default ?? _createCache) as typeof _createCache
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const createEmotionServer = ((_createEmotionServer as any).default ??
  _createEmotionServer) as typeof _createEmotionServer

function getI18nBackendOpts() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const baseLocalesPath = path.resolve(dirname, '..', '..', 'public', 'locales')
  return {
    loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
    addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
  }
}

const passToClient = ['locale', 'preloadedState', 'pageProps']

/** Queries needed by all pages */
const { initiate: getContent } = contentApi.endpoints.getContent
const commonPrepopFactories: PrepopFactory[] = [
  (store) => store.dispatch(contentApi.endpoints.getManifest.initiate()),
  (store, locale) => fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_A })),
  (store, locale) => fetchContent(store, getContent({ locale, path: CONTENT_NAME_FOOTER_B })),
]

function render({ emotionStyleTags, helmet, pageHtml, redirectTo }: PageContextServer) {
  if (redirectTo !== undefined) {
    return { pageContext: { redirectTo } }
  }

  // Script that reads from localStorage and sets mode on html tag before
  // page is rendered (avoid color mode flicker)
  const initColorSchemeScript = renderToStaticMarkup(
    getInitColorSchemeScript({ defaultMode: 'system' })
  )

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet.htmlAttributes.toString())}>
      <head>
        ${dangerouslySkipEscape(helmet.title.toString())}
        ${dangerouslySkipEscape(helmet.meta.toString())}
        ${dangerouslySkipEscape(helmet.link.toString())}
        ${dangerouslySkipEscape(emotionStyleTags)}
      </head>
      <body ${dangerouslySkipEscape(helmet.bodyAttributes.toString())}>
        ${dangerouslySkipEscape(initColorSchemeScript)}
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

async function onBeforeRender({
  locale,
  Page,
  pageProps = {},
  pagePrepopFactories = [],
  urlPathname,
}: PageContextServer): Promise<{ pageContext: Partial<PageContextServer> }> {
  // Initialize store
  const store = makeStore()

  // Seed initial data to store
  store.dispatch(changeUrlWithoutLocale(urlPathname))
  store.dispatch(changeLocale(locale))

  // Prepopulate store with data necessary to render page
  await Promise.all(
    [...commonPrepopFactories, ...pagePrepopFactories].map((factory) => factory(store, locale))
  )

  // Assert we received locales from manifest
  const locales = selectLocales(store.getState())
  if (locales.length < 1) {
    throw RenderErrorPage({ pageContext: { errorMsg: 'Could not retrieve course locales!' } })
  }

  // TODO: how to handle this correctly?
  if (urlPathname === '/fake-404-url') {
    locale = 'en'
  }

  // Check if locale is valid
  if (!locales.includes(locale)) {
    throw RenderErrorPage({ pageContext: { is404: true } })
  }

  // Redirect '/' to homeLink
  const homeLink = selectHomeLink(store.getState())
  if (urlPathname === '/' && homeLink !== undefined) {
    return {
      pageContext: {
        redirectTo: formatUrl(replacePathPrefixes(homeLink), locale),
      },
    }
  }

  // Initialize emotion cache
  const emotionCache = createCache({ key: 'emotion-style' })

  // Initialize i18next
  const i18n = await getI18n(I18NextFsBackend, getI18nBackendOpts(), locale, store)

  // Initialize helmet context
  const helmetContext = {}

  // Render page
  const pageHtml = await renderToHtml(
    <PageShell emotionCache={emotionCache} helmetContext={helmetContext} i18n={i18n} store={store}>
      <Page {...pageProps} />
    </PageShell>
  )

  // Get document head tags
  const { helmet } = helmetContext as FilledContext

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { constructStyleTagsFromChunks, extractCriticalToChunks } =
    createEmotionServer(emotionCache)
  const emotionStyleTags = constructStyleTagsFromChunks(extractCriticalToChunks(pageHtml))

  // Grab populated state
  const preloadedState = store.getState()

  return {
    pageContext: {
      emotionStyleTags,
      helmet,
      pageHtml,
      pageProps,
      preloadedState,
    },
  }
}

// Build correct URLs with locales for prerendering from pages
async function onBeforePrerender(globalContext: {
  prerenderPageContexts: PrerenderingPageContext[]
}) {
  // Get course locales
  const store = makeStore()
  await store.dispatch(contentApi.endpoints.getManifest.initiate())
  const locales = selectLocales(store.getState())

  // For each page add locale pages
  const prerenderPageContexts: PrerenderingPageContext[] = []
  globalContext.prerenderPageContexts.forEach((pageContext) => {
    locales.forEach((locale) => {
      prerenderPageContexts.push({
        ...pageContext,
        urlOriginal: formatUrl(pageContext.urlOriginal, locale),
        locale,
      })
    })
  })

  return {
    globalContext: { prerenderPageContexts },
  }
}

type PrerenderingPageContext = Pick<PageContextServer, 'locale' | 'urlOriginal'>

export { getI18nBackendOpts, onBeforePrerender, onBeforeRender, passToClient, render }
