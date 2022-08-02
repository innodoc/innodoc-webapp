import createCache from '@emotion/cache'
import { hydrateRoot } from 'react-dom/client'

import makeStore from '@/store/makeStore'
import type { PageContextClient } from '@/types/page'
import PageShell from '@/ui/components/PageShell'

function render(pageContext: PageContextClient) {
  const { Page, pageProps, PRELOADED_STATE } = pageContext

  const store = makeStore(PRELOADED_STATE)

  // Client-side cache, shared for the whole session of the user in the browser.
  const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
    'meta[name="emotion-insertion-point"]'
  )
  if (emotionInsertionPoint === null) {
    throw new Error('Could not find emotion insertion meta tag.')
  }
  const emotionCache = createCache({ key: 'mui-style', insertionPoint: emotionInsertionPoint })

  const rootEl = document.getElementById('root')

  if (rootEl === null) {
    throw new Error('Could not hydrate. Root container not found!')
  }

  hydrateRoot(
    rootEl,
    <PageShell emotionCache={emotionCache} pageContext={pageContext} store={store}>
      <Page {...pageProps} />
    </PageShell>
  )
}

export { render }
export const clientRouting = true
