import React from 'react'
import PropTypes from 'prop-types'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { END } from 'redux-saga'
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

const InnoDocApp = ({ Component, mathJaxOptions, pageProps }) => (
  <>
    <PageTitle />
    <MathJax.ConfigProvider options={mathJaxOptions}>
      <Component
        {...pageProps} // eslint-disable-line react/jsx-props-no-spreading
      />
    </MathJax.ConfigProvider>
    <RouteNotifier />
  </>
)

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  mathJaxOptions: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
}

InnoDocApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}

  // Stop the saga if on server
  if (ctx.req) {
    ctx.store.dispatch(END)
    await ctx.store.sagaTask.toPromise()
  }

  return {
    pageProps: {
      ...pageProps,
      namespacesRequired: ['common'],
    },
  }
}

// next-redux-wrapper needs HYDRATE action to be handled
const getRootReducer = (innerReducer) => (state, action) =>
  action.type === HYDRATE
    ? { ...state, ...action.payload }
    : innerReducer(state, action)

const makeStore = makeMakeStore(rootSaga, getRootReducer)
const { withRedux } = createWrapper(makeStore)

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
  withRedux,
]

export { InnoDocApp } // for testing
export default hocs.reduce((acc, hoc) => hoc(acc), InnoDocApp)
