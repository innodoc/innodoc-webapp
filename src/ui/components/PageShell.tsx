import { CacheProvider, type EmotionCache } from '@emotion/react'
import { StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import type { Store } from '@/store/makeStore'
import type { PageContext } from '@/types/page'
import { PageContextProvider } from '@/ui/contexts/PageContext'

import Layout from './Layout/Layout'

function PageShell({ children, emotionCache, pageContext, store }: PageShellProps) {
  return (
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <ReduxProvider store={store}>
          <PageContextProvider pageContext={pageContext}>
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
  pageContext: PageContext
  store: Store
}

export default PageShell
