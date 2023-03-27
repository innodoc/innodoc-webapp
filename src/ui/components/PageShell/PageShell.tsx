import { CacheProvider, type EmotionCache } from '@emotion/react'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import type { i18n as I18n } from 'i18next'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'

import type { Store } from '#store/makeStore'
import Layout from '#ui/components/Layout/Layout'
import { MarkdownWorkerProvider } from '#ui/contexts/MarkdownWorkerContext/MarkdownWorkerContext'
import { RouteTransitionProvider } from '#ui/contexts/RouteTransitionContext'

import MetaTags from './MetaTags'
import theme from './theme'

const globalStyles = {
  html: { scrollBehavior: 'smooth' },
} as const

function PageShell({ children, emotionCache, helmetContext, i18n, store }: PageShellProps) {
  return (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <CacheProvider value={emotionCache}>
          <GlobalStyles styles={globalStyles} />
          <ReduxProvider store={store}>
            <MarkdownWorkerProvider>
              <RouteTransitionProvider>
                <I18nextProvider i18n={i18n}>
                  <CssVarsProvider theme={theme}>
                    <CssBaseline />
                    <MetaTags />
                    <Layout>{children}</Layout>
                  </CssVarsProvider>
                </I18nextProvider>
              </RouteTransitionProvider>
            </MarkdownWorkerProvider>
          </ReduxProvider>
        </CacheProvider>
      </HelmetProvider>
    </StrictMode>
  )
}

interface PageShellProps {
  children: React.ReactNode
  helmetContext?: Record<string, never>
  emotionCache: EmotionCache
  i18n: I18n
  store: Store
}

export default PageShell
