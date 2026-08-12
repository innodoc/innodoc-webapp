import type { EmotionCache } from '@emotion/react'
import type { PropsWithChildren } from 'react'
import { CacheProvider } from '@emotion/react'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@innodoc/ui-design-system/theme'
import { useRouteSync } from '@innodoc/ui-shared/hooks'
import Layout from '#layout'

// import MetaTags from './MetaTags.js'

const globalStyles = {
  html: { scrollBehavior: 'smooth' },
} as const

function PageShell({ children, emotionCache }: PageShellProps) {
  useRouteSync()

  return (
    <CacheProvider value={emotionCache}>
      <GlobalStyles styles={globalStyles} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <MetaTags /> */}
        <Layout>{children}</Layout>
      </ThemeProvider>
    </CacheProvider>
  )
}

interface PageShellProps extends PropsWithChildren {
  emotionCache: EmotionCache
}

export default PageShell
