import { CacheProvider, type EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'

// Material UI font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { wrapper } from '@innodoc/store'
import { SwitchableThemeProvider, Layout } from '@innodoc/ui'

import createEmotionCache from '../lib/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

function InnodocApp(props: InnodocAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SwitchableThemeProvider>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SwitchableThemeProvider>
    </CacheProvider>
  )
}

type InnodocAppProps = Omit<AppProps, 'pageProps'> & InnodocAppInitialProps & EmotionCacheProps
export type InnodocAppInitialProps = { pageProps: Record<string, never> }
export type EmotionCacheProps = { emotionCache?: EmotionCache }

export default appWithTranslation(wrapper.withRedux(InnodocApp))
