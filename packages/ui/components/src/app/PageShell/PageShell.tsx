import { CacheProvider, type EmotionCache } from '@emotion/react'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider, GlobalStyles } from '@mui/material'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import type { i18n as I18n } from 'i18next'
import type { ReactNode } from 'react'
import type { HelmetServerState } from 'react-helmet-async'
import type { PageContext } from 'vike/types'

import { VikePageContextProvider } from '@innodoc/contexts'
import type { Store } from '@innodoc/store/types'

import theme from '#theme'

import Layout from './Layout/Layout.js'
import MetaTags from './MetaTags.js'

const globalStyles = {
  html: { scrollBehavior: 'smooth' },
} as const

function PageShell({ children, emotionCache, helmetContext, i18n, pageContext, store }: PageShellProps) {
  return (
    <StrictMode>
      <VikePageContextProvider pageContext={pageContext}>
        <HelmetProvider context={helmetContext}>
          <CacheProvider value={emotionCache}>
            <GlobalStyles styles={globalStyles} />
            <ReduxProvider store={store}>
              <I18nextProvider i18n={i18n}>
                <CssVarsProvider theme={theme}>
                  <CssBaseline />
                  <MetaTags />
                  <Layout>{children}</Layout>
                </CssVarsProvider>
              </I18nextProvider>
            </ReduxProvider>
          </CacheProvider>
        </HelmetProvider>
      </VikePageContextProvider>
    </StrictMode>
  )
}

interface PageShellProps {
  children: ReactNode
  emotionCache: EmotionCache
  helmetContext?: { helmet?: HelmetServerState }
  i18n: I18n
  pageContext: PageContext
  store: Store
}

export default PageShell
