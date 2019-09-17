import React from 'react'
import { connect, Provider } from 'react-redux'
import Head from 'next/head'
import App from 'next/app'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'

import '../style/lato-font.sass'

import 'antd/es/style/index.less'
import 'antd/es/affix/style/index.less'
import 'antd/es/breadcrumb/style/index.less'
import 'antd/es/button/style/index.less'
import 'antd/es/card/style/index.less'
import 'antd/es/checkbox/style/index.less'
import 'antd/es/collapse/style/index.less'
import 'antd/es/drawer/style/index.less'
import 'antd/es/grid/style/index.less'
import 'antd/es/icon/style/index.less'
import 'antd/es/input/style/index.less'
import 'antd/es/layout/style/index.less'
import 'antd/es/list/style/index.less'
import 'antd/es/menu/style/index.less'
import 'antd/es/modal/style/index.less'
import 'antd/es/popover/style/index.less'
import 'antd/es/result/style/index.less'
import 'antd/es/table/style/index.less'
import 'antd/es/tag/style/index.less'
import 'antd/es/tree/style/index.less'

import { appWithTranslation } from '@innodoc/client-misc/src/i18n'
import rootSaga from '@innodoc/client-sagas'
import makeMakeStore from '@innodoc/client-store/src/store'
import { loadManifest, navigate, setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'

class InnoDocApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if (ctx.req && ctx.res) { // ctx.req/ctx.res not present when statically exported
      // set initial content URLs (passed from server.js/app configuration)
      const {
        contentRoot,
        staticRoot,
        sectionPathPrefix,
        pagePathPrefix,
      } = ctx.res.locals
      ctx.store.dispatch(
        setServerConfiguration(contentRoot, staticRoot, sectionPathPrefix, pagePathPrefix)
      )
      // pass detected language to store
      if (ctx.req.i18n) {
        ctx.store.dispatch(languageDetected(ctx.req.i18n.language))
      }
      // load content manifest on start-up
      ctx.store.dispatch(loadManifest())
    }

    // page props
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

  render() {
    const {
      Component,
      dispatchNavigate,
      pageProps,
      store,
    } = this.props

    if (process.browser) {
      Router.events.on('routeChangeStart', dispatchNavigate)
    }

    return (
      <>
        <Head>
          <title key="title">
            innoDoc web app
          </title>
        </Head>
        <Provider store={store}>
          <Component statusCode={pageProps.statusCode} />
        </Provider>
      </>
    )
  }
}

const nextReduxWrapperDebug = process.env.NODE_ENV !== 'production' && process.env.NEXT_REDUX_WRAPPER_DEBUG === 'true'
const withReduxConfig = { debug: nextReduxWrapperDebug }

export { InnoDocApp } // for testing
export default withRedux(makeMakeStore(rootSaga), withReduxConfig)(
  appWithTranslation(
    withReduxSaga(
      connect(null, { dispatchNavigate: navigate })(
        InnoDocApp
      )
    )
  )
)
