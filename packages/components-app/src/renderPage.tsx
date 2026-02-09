import type { EmotionCache } from '@emotion/react'
import type { i18n as I18nInstance } from 'i18next'
import type { ComponentType } from 'react'
import type { HelmetServerState } from 'react-helmet-async'
import type { PageContext } from 'vike/types'

import type { Store } from '@innodoc/store/types'

import PageShell from './PageShell/PageShell.js'
import RouteTransition from './RouteTransition.js'

function renderPage(
  pageContext: PageContext,
  Page: ComponentType,
  emotionCache: EmotionCache,
  i18n: I18nInstance,
  store: Store,
  helmetContext?: { helmet?: HelmetServerState },
  pagePrev?: ComponentType,
) {
  return (
    <PageShell
      emotionCache={emotionCache}
      helmetContext={helmetContext}
      i18n={i18n}
      pageContext={pageContext}
      store={store}
    >
      <RouteTransition pagePrev={pagePrev}>
        <Page />
      </RouteTransition>
    </PageShell>
  )
}

export default renderPage
