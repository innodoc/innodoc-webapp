import { CacheProvider } from '@emotion/react'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider, GlobalStyles } from '@mui/material'
import type { EmotionCache } from '@emotion/react'
import type { PropsWithChildren } from 'react'

import theme from '@innodoc/ui-design-system/theme'

import Layout from '#layout'

// import MetaTags from './MetaTags.js'

const globalStyles = {
  html: { scrollBehavior: 'smooth' },
} as const

function PageShell({ children, emotionCache }: PageShellProps) {
  return (
    <CacheProvider value={emotionCache}>
      <GlobalStyles styles={globalStyles} />
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {/* <MetaTags /> */}
        <Layout>{children}</Layout>
      </CssVarsProvider>
    </CacheProvider>
  )
}

interface PageShellProps extends PropsWithChildren {
  emotionCache: EmotionCache
}

export default PageShell
