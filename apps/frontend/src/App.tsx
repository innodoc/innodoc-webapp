import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Route, Router, Switch } from 'wouter'
import type { EmotionCache } from '@emotion/react'
import type I18n from 'i18next'

import PageShell from '@innodoc/ui-features/page-shell'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteName } from '@innodoc/shared-core/types'
import type { Store } from '@innodoc/ui-store/types'

interface PageComponentProps {
  routeName: FrontendRouteName
}

function PageComponent({ routeName }: PageComponentProps) {
  switch (routeName) {
    case 'app:index': {
      return 'Index Page TMP'
      // return <IndexPage />
    }
    case 'app:course:index': {
      return 'app:course:index'
    }
    // default: {
    //   return <ErrorPage is404 />
    // }
  }

  return null
}

interface RoutesSwitchProps {
  routeManager: RouteManager
}

function RoutesSwitch({ routeManager }: RoutesSwitchProps) {
  const frontendRoutes = routeManager.getFrontendRoutes()
  const routeEntries = Object.entries(frontendRoutes) as [FrontendRouteName, string][]

  const routes = routeEntries.map(([name, path]) => (
    <Route key={name} path={path}>
      <PageComponent routeName={name} />
    </Route>
  ))

  return <Switch>{routes}</Switch>
}

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
          <PageShell emotionCache={emotionCache}>
            <Router ssrPath={url}>
              <RoutesSwitch routeManager={routeManager} />
            </Router>
          </PageShell>
        </RouteManagerProvider>
      </I18nextProvider>
    </ReduxProvider>
  )
}

export default App
