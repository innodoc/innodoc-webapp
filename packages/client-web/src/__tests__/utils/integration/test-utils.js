// Custom render function for RTL that adds providers

import { render as rtlRender } from '@testing-library/react'
import singletonRouter from 'next/router'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { appWithTranslation } from 'next-i18next'

import i18nConfig from '../../../../next.config/next-i18next.config.js'
import nextReduxWrapper from '../../../store.js'

// Add I18nextProvider
const _nextI18Next = {
  userConfig: {
    i18n: {
      ...i18nConfig.i18n,
      // not using 'cimode' as <Trans> would not render any sub-components
      defaultLocale: 'en',
      // wait for translation to be loaded sync so they are guaranteed to be
      // available when we render
      initImmediate: false,
    },
  },
}

const WrappedTranslated = appWithTranslation(({ children }) => children)
const WrappedWithPageProps = ({ children }) => (
  <WrappedTranslated pageProps={{ _nextI18Next }}>{children}</WrappedTranslated>
)

// Add redux provider
const WrappedRedux = nextReduxWrapper.withRedux(WrappedWithPageProps)

// Add RouterContext.Provider
const WrappedRouter = ({ children }) => (
  <RouterContext.Provider value={singletonRouter}>
    <WrappedRedux>{children}</WrappedRedux>
  </RouterContext.Provider>
)

// Wrap original render function
const render = (ui, options) => rtlRender(ui, { wrapper: WrappedRouter, ...options })

// Re-export everything from RTL
export * from '@testing-library/react'

// Override render method
export { render }
