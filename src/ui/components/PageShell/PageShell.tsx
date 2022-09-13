import { CacheProvider, type EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles/index.js'
import type { i18n } from 'i18next'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'

import type { Store } from '@/store/makeStore'
import Layout from '@/ui/components/Layout/Layout'

import theme from './theme'

function PageShell({ children, emotionCache, helmetContext, i18n, store }: PageShellProps) {
  return (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <CacheProvider value={emotionCache}>
          <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
              <CssVarsProvider theme={theme}>
                <CssBaseline />
                <Layout>{children}</Layout>
              </CssVarsProvider>
            </I18nextProvider>
          </ReduxProvider>
        </CacheProvider>
      </HelmetProvider>
    </StrictMode>
  )
}

type PageShellProps = {
  children: React.ReactNode
  helmetContext?: Record<string, never>
  emotionCache: EmotionCache
  i18n: i18n
  store: Store
}

export default PageShell
