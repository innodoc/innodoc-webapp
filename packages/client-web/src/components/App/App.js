import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import withReduxSaga from 'next-redux-saga'
import { END } from 'redux-saga'
import MathJax from '@innodoc/react-mathjax-node'
import { withServerContext } from 'next-server-context'

import '@innodoc/client-web/src/style/lato-font.sss'
import '@innodoc/client-web/src/style/svg-icons-stroke.sss'
import '@innodoc/client-web/src/style/fix-code-wrap.sss'

import { appWithTranslation } from '@innodoc/common/src/i18n'

import PageTitle from '../PageTitle'
import useRouteNotifier from '../../hooks/useRouteNotifier'
import withServerVars from './withServerVars'
import withLoadManifest from './withLoadManifest'
import withMathJaxOptions from './withMathJaxOptions'
import withNextRedux from './withNextRedux'

const InnoDocApp = ({ Component, mathJaxOptions, pageProps }) => {
  useRouteNotifier() // Notify store about Next.js route changes
  return (
    <>
      <Head>
        <meta content="initial-scale=1.0, width=device-width" key="viewport" name="viewport" />
      </Head>
      <PageTitle />
      <MathJax.ConfigProvider options={mathJaxOptions}>
        <Component
          {...pageProps} // eslint-disable-line react/jsx-props-no-spreading
        />
      </MathJax.ConfigProvider>
    </>
  )
}

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  mathJaxOptions: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
}

InnoDocApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

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

const hocs = [
  withServerContext,
  withMathJaxOptions,
  ...(typeof window === 'undefined'
    ? [
        // Only server-side
        withLoadManifest,
        withServerVars,
      ]
    : []),
  appWithTranslation,
  withReduxSaga,
  withNextRedux,
]

export { InnoDocApp } // for testing
export default hocs.reduce((acc, hoc) => hoc(acc), InnoDocApp)
