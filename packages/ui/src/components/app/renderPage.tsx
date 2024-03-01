import type { EmotionCache } from '@emotion/react'
import type { i18n as I18nInstance } from 'i18next'
import type { ComponentType } from 'react'
import type { PageContext } from 'vike/types'

import type { Store } from '@innodoc/store/types'

import PageShell from './PageShell/PageShell'
import RouteTransition from './RouteTransition'

function renderPage(
  pageContext: PageContext,
  Page: ComponentType,
  store: Store,
  emotionCache: EmotionCache,
  i18n: I18nInstance,
  helmetContext?: Record<string, never>,
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
