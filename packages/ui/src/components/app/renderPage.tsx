import type { EmotionCache } from '@emotion/react'
import type { Store } from '@innodoc/store/types'
import type { i18n as I18nInstance } from 'i18next'
import type { ComponentType } from 'react'

import PageShell from './PageShell/PageShell'
import RouteTransition from './RouteTransition'

function renderPage(
  Page: ComponentType,
  emotionCache: EmotionCache,
  i18n: I18nInstance,
  store: Store,
  helmetContext?: Record<string, never>,
  pagePrev?: ComponentType
) {
  return (
    <PageShell emotionCache={emotionCache} helmetContext={helmetContext} i18n={i18n} store={store}>
      <RouteTransition pagePrev={pagePrev}>
        <Page />
      </RouteTransition>
    </PageShell>
  )
}

export default renderPage
