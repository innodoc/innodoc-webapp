import type { EmotionCache } from '@emotion/react'
import type I18n from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'wouter'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { Store } from '@innodoc/shared-store/types'
import PageShell from '@innodoc/ui-features/page-shell'
import RoutesSwitch from '@innodoc/ui-features/routes-switch'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'

interface AppProps {
  emotionCache: EmotionCache
  i18n: typeof I18n
  routeManager: RouteManager
  url?: string
  store: Store
}

function App({ emotionCache, i18n, url, routeManager, store }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <RouteManagerProvider routeManager={routeManager}>
          <Router ssrPath={url}>
            <PageShell emotionCache={emotionCache}>
              <RoutesSwitch routeManager={routeManager} />
            </PageShell>
          </Router>
        </RouteManagerProvider>
      </I18nextProvider>
    </ReduxProvider>
  )
}

export default App
