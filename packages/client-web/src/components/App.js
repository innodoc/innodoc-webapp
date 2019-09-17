import React from 'react'
import { connect, Provider } from 'react-redux'
import Head from 'next/head'
import App from 'next/app'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'

import '../style/lato-font.sass'

import 'antd/lib/style/index.less'
import 'antd/lib/affix/style/index.less'
import 'antd/lib/breadcrumb/style/index.less'
import 'antd/lib/button/style/index.less'
import 'antd/lib/card/style/index.less'
import 'antd/lib/checkbox/style/index.less'
import 'antd/lib/collapse/style/index.less'
import 'antd/lib/drawer/style/index.less'
import 'antd/lib/grid/style/index.less'
import 'antd/lib/icon/style/index.less'
import 'antd/lib/input/style/index.less'
import 'antd/lib/layout/style/index.less'
import 'antd/lib/list/style/index.less'
import 'antd/lib/menu/style/index.less'
import 'antd/lib/modal/style/index.less'
import 'antd/lib/popover/style/index.less'
import 'antd/lib/result/style/index.less'
import 'antd/lib/table/style/index.less'
import 'antd/lib/tag/style/index.less'
import 'antd/lib/tree/style/index.less'

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
