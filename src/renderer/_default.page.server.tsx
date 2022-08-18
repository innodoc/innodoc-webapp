import path from 'path'
import { fileURLToPath } from 'url'

import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import I18NextFsBackend from 'i18next-fs-backend'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, RenderErrorPage } from 'vite-plugin-ssr'

// Material UI font
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'

import logoUrl from '@/assets/logo.svg'
import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import makeStore from '@/store/makeStore'
import { selectLocales } from '@/store/selectors/content'
import { changeLocale, changeUrlWithoutLocale } from '@/store/slices/uiSlice'
import type { PageContextServer, QueryFactory } from '@/types/page'
import PageShell from '@/ui/components/PageShell/PageShell'
import getI18n from '@/utils/getI18n'

import { fetchContent, fetchManifest } from './fetchData'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const baseLocalesPath = path.resolve(dirname, '..', '..', 'public', 'locales')
const i18nBackendOpts = {
  loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
  addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
}

const passToClient = ['locale', 'preloadedState', 'pageProps']

/** Queries needed by all pages */
const commonQueryFactories: QueryFactory[] = [
  () => fetchManifest(),
  (locale) => fetchContent({ locale, path: CONTENT_NAME_FOOTER_A }),
  (locale) => fetchContent({ locale, path: CONTENT_NAME_FOOTER_B }),
]

function render({ documentProps, pageHtml, emotionStyleTags }: PageContextServer) {
  const title = (documentProps && documentProps.title) || 'TODO'
  const desc = (documentProps && documentProps.description) || 'TODO'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <link rel="icon" href="${logoUrl}" />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <meta name="emotion-insertion-point" content="" />
        ${dangerouslySkipEscape(emotionStyleTags)}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

async function onBeforeRender({
  locale,
  Page,
  pageProps = {},
  pageQueryFactories = [],
  url,
}: PageContextServer) {
  // Initialize store
  const store = makeStore()

  // Seed initial data to store
  store.dispatch(changeUrlWithoutLocale(url))
  store.dispatch(changeLocale(locale))

  // Fetch data necessary to render page
  await Promise.all(
    [...commonQueryFactories, ...pageQueryFactories].map((makeAction) =>
      store.dispatch(makeAction(locale))
    )
  )

  // Assert we received locales from manifest
  const locales = selectLocales(store.getState())
  if (locales.length < 1) {
    throw RenderErrorPage({ pageContext: { errorMsg: 'Could not retrieve course locales!' } })
  }

  // Check if locale is valid
  if (!locales.includes(locale)) {
    throw RenderErrorPage({ pageContext: { is404: true } })
  }

  // Initialize emotion cache
  const emotionCache = createCache({ key: 'emotion-style' })

  // Initialize i18next
  const i18n = await getI18n(I18NextFsBackend, i18nBackendOpts, locale, store)

  // Render page
  const pageHtml = renderToString(
    <PageShell emotionCache={emotionCache} i18n={i18n} store={store}>
      <Page {...pageProps} />
    </PageShell>
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { constructStyleTagsFromChunks, extractCriticalToChunks } =
    createEmotionServer(emotionCache)
  const chunks = extractCriticalToChunks(pageHtml)
  const emotionStyleTags = constructStyleTagsFromChunks(chunks)

  // Grab populated state
  const preloadedState = store.getState()

  return {
    pageContext: {
      emotionStyleTags,
      pageHtml,
      pageProps,
      preloadedState,
    },
  }
}

export { onBeforeRender, passToClient, render }
