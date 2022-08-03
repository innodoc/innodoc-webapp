import path from 'path'
import { fileURLToPath } from 'url'

import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import I18NextFsBackend from 'i18next-fs-backend'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, RenderErrorPage } from 'vite-plugin-ssr'

// Material UI font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import logoUrl from '@/assets/logo.svg'
import makeStore from '@/store/makeStore'
import { selectLocales } from '@/store/selectors/content'
import type { PageContextServer } from '@/types/page'
import PageShell from '@/ui/components/PageShell'
import getI18n from '@/utils/getI18n'

import { loadManifest } from './fetchData'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const baseLocalesPath = path.resolve(dirname, '..', '..', 'public', 'locales')
const i18nBackendOpts = {
  loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
  addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
}

const passToClient = ['locale', 'PRELOADED_STATE', 'pageProps']

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

async function onBeforeRender(pageContext: PageContextServer) {
  const store = makeStore()
  const { locale, Page, pageProps } = pageContext

  // Fetch course manifest
  await loadManifest(store)

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
    <PageShell
      emotionCache={emotionCache}
      i18n={i18n}
      pageContext={{ ...pageContext, isHydration: true }}
      store={store}
    >
      <Page {...pageProps} />
    </PageShell>
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { constructStyleTagsFromChunks, extractCriticalToChunks } =
    createEmotionServer(emotionCache)
  const chunks = extractCriticalToChunks(pageHtml)
  const emotionStyleTags = constructStyleTagsFromChunks(chunks)

  // Grab populated state
  const PRELOADED_STATE = store.getState()

  return {
    pageContext: {
      emotionStyleTags,
      pageHtml,
      pageProps,
      PRELOADED_STATE,
      store,
    },
  }
}

export { onBeforeRender, passToClient, render }
