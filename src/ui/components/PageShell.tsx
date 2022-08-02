import { CacheProvider, type EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import type { Store } from '@/store/makeStore'
import type { PageContextClient } from '@/types/page'
import { PageContextProvider } from '@/ui/contexts/PageContext'

import Layout from './Layout/Layout'

function PageShell({ children, emotionCache, pageContext, store }: PageShellProps) {
  return (
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <ReduxProvider store={store}>
          <PageContextProvider pageContext={pageContext}>
            <CssBaseline />
            <Layout>{children}</Layout>
          </PageContextProvider>
        </ReduxProvider>
      </CacheProvider>
    </StrictMode>
  )
}

type PageShellProps = {
  children: React.ReactNode
  emotionCache: EmotionCache
  pageContext: PageContextClient
  store: Store
}

export default PageShell
