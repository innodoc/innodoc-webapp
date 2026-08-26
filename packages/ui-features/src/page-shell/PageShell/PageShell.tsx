import type { EmotionCache } from '@emotion/react'
import type { PropsWithChildren } from 'react'
import { CacheProvider } from '@emotion/react'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@innodoc/ui-design-system/theme'
import Layout from '#layout'
import MetaTags from './MetaTags.js'

// View Transitions API page fade (keep the default crossfade keyframes, only control duration/easing)
// Theme durations are millisecond numbers; CSS needs a string
const viewTransitionStyles = {
  animationDuration: `${String(theme.transitions.duration.standard)}ms`,
  animationTimingFunction: theme.transitions.easing.easeInOut,
} as const

const globalStyles = {
  html: { scrollBehavior: 'smooth' },
  '::view-transition-old(root)': viewTransitionStyles,
  '::view-transition-new(root)': viewTransitionStyles,
} as const

function PageShell({ children, emotionCache }: PageShellProps) {
  return (
    <CacheProvider value={emotionCache}>
      <GlobalStyles styles={globalStyles} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MetaTags />
        <Layout>{children}</Layout>
      </ThemeProvider>
    </CacheProvider>
  )
}

interface PageShellProps extends PropsWithChildren {
  emotionCache: EmotionCache
}

export default PageShell
