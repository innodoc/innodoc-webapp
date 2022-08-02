import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

// Material UI font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import logoUrl from '@/assets/logo.svg'
import makeStore from '@/store/makeStore'
import type { PageContextServer } from '@/types/page'
import PageShell from '@/ui/components/PageShell'

import { loadManifest } from './fetchData'

const passToClient = ['PRELOADED_STATE', 'pageProps']

function render({ documentProps, pageHtml, emotionStyleTags }: PageContextServer) {
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'App using Vite + vite-plugin-ssr'

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
  const { Page } = pageContext
  const pageProps = {}

  const emotionCache = createCache({ key: 'emotion-style' })

  await loadManifest(store)

  const pageHtml = renderToString(
    <PageShell
      emotionCache={emotionCache}
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

  // Grab the initial state from store
  const PRELOADED_STATE = store.getState()

  return {
    pageContext: {
      pageHtml,
      pageProps,
      PRELOADED_STATE,
      emotionStyleTags,
    },
  }
}

export { onBeforeRender, passToClient, render }
