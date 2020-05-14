import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import MathJax from '@innodoc/react-mathjax-node'
import { withServerContext } from 'next-server-context'

import '@innodoc/client-web/src/style/lato-font.sss'

import { appWithTranslation as withTranslation } from '@innodoc/client-misc/src/i18n'
import rootSaga from '@innodoc/client-sagas'
import makeMakeStore from '@innodoc/client-store/src/store'

import PageTitle from '../PageTitle'
import RouteNotifier from './RouteNotifier'
import withDispatchConfiguration from './withDispatchConfiguration'
import withIndexRedirect from './withIndexRedirect'
import withMathJaxOptions from './withMathJaxOptions'
import withWaitForManifest from './withWaitForManifest'

const InnoDocApp = ({ Component, mathJaxOptions, pageProps, store }) => (
  <Provider store={store}>
    <PageTitle />
    <MathJax.ConfigProvider options={mathJaxOptions}>
      <Component
        {...pageProps} // eslint-disable-line react/jsx-props-no-spreading
      />
    </MathJax.ConfigProvider>
    <RouteNotifier />
  </Provider>
)

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  mathJaxOptions: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

InnoDocApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}
  return {
    pageProps: {
      ...pageProps,
      namespacesRequired: ['common'],
    },
  }
}

const hocs = [
  withTranslation,
  withServerContext,
  withMathJaxOptions,
  ...(typeof window === 'undefined'
    ? [
        // Only server-side
        withIndexRedirect,
        withWaitForManifest,
        withDispatchConfiguration,
      ]
    : []),
  withReduxSaga,
  withRedux(makeMakeStore(rootSaga)),
]

export { InnoDocApp } // for testing
export default hocs.reduce((acc, hoc) => hoc(acc), InnoDocApp)
