import createCache from '@emotion/cache'
import I18NextHttpBackend from 'i18next-http-backend'
import { hydrateRoot } from 'react-dom/client'

import makeStore from '@/store/makeStore'
import type { PageContextClient } from '@/types/page'
import PageShell from '@/ui/components/PageShell'
import makeI18n from '@/utils/makeI18n'

const i18nBackendOpts = { loadPath: import.meta.env.BASE_URL + 'locales/{{lng}}/{{ns}}.json' }

async function render(pageContext: PageContextClient) {
  const { Page, pageProps, PRELOADED_STATE } = pageContext

  const store = makeStore(PRELOADED_STATE)

  // Initialize i18next
  const i18n = await makeI18n(I18NextHttpBackend, i18nBackendOpts, pageContext.locale, store)

  // Client-side cache, shared for the whole session of the user in the browser.
  const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
    'meta[name="emotion-insertion-point"]'
  )
  if (emotionInsertionPoint === null) {
    throw new Error('Could not find emotion insertion meta tag.')
  }
  const emotionCache = createCache({ key: 'emotion-style', insertionPoint: emotionInsertionPoint })

  // Hydrate app
  const rootEl = document.getElementById('root')
  if (rootEl === null) {
    throw new Error('Could not hydrate. Root container not found!')
  }
  hydrateRoot(
    rootEl,
    <PageShell emotionCache={emotionCache} i18n={i18n} pageContext={pageContext} store={store}>
      <Page {...pageProps} />
    </PageShell>
  )
}

export { render }
export const clientRouting = true
