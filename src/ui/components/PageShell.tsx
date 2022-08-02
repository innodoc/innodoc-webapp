import { CacheProvider, type EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import type { i18n } from 'i18next'
import { StrictMode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'

import type { Store } from '@/store/makeStore'
import type { PageContextClient } from '@/types/page'
import { PageContextProvider } from '@/ui/contexts/PageContext'

import Layout from './Layout/Layout'

function PageShell({ children, emotionCache, i18n, pageContext, store }: PageShellProps) {
  return (
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n}>
            <PageContextProvider pageContext={pageContext}>
              <CssBaseline />
              <Layout>{children}</Layout>
            </PageContextProvider>
          </I18nextProvider>
        </ReduxProvider>
      </CacheProvider>
    </StrictMode>
  )
}

type PageShellProps = {
  children: React.ReactNode
  emotionCache: EmotionCache
  i18n: i18n
  pageContext: PageContextClient
  store: Store
}

export default PageShell
