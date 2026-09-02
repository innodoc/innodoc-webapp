import type { EmotionCache } from '@emotion/react'
import type I18n from 'i18next'
import { useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'wouter'
import type { RouteManager } from '@innodoc/shared-core/routes'
import { RouteManagerProvider } from '@innodoc/shared-core/routes'
import type { Store } from '@innodoc/shared-store/types'
import PageShell from '@innodoc/ui-features/page-shell'
import RoutesSwitch from '@innodoc/ui-features/routes-switch'
import { makeRouteNavigator } from './route-navigator.js'
import useHistorySync from './use-history-sync.js'

interface AppProps {
  emotionCache: EmotionCache
  i18n: typeof I18n
  routeManager: RouteManager
  url?: string
  store: Store
}

function App({ emotionCache, i18n, url, routeManager, store }: AppProps) {
  const routeNavigator = useMemo(() => makeRouteNavigator(routeManager, store), [routeManager, store])

  // Follow the browser's back and forward buttons, which wouter's aroundNav never sees
  useHistorySync(routeNavigator)

  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <RouteManagerProvider routeManager={routeManager}>
          <Router ssrPath={url} aroundNav={routeNavigator.aroundNav}>
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
