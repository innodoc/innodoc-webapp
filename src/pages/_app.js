import React from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'

import '../style/lato-font.sass'

import 'antd/lib/style/index.less'
import 'antd/lib/grid/style/index.less'
import 'antd/lib/layout/style/index.less'
import 'antd/lib/menu/style/index.less'
import 'antd/lib/tree/style/index.less'
import 'antd/lib/input/style/index.less'
import 'antd/lib/button/style/index.less'
import 'antd/lib/modal/style/index.less'
import 'antd/lib/alert/style/index.less'
import 'antd/lib/breadcrumb/style/index.less'
import 'antd/lib/skeleton/style/index.less'
import 'antd/lib/list/style/index.less'

import configureStore from '../store'
import { setContentRoot, loadToc } from '../store/actions/content'

class InnoDocApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if (ctx.isServer) {
      // set initial content URL
      ctx.store.dispatch(setContentRoot(ctx.res.locals.contentRoot))
      // initially load TOC
      ctx.store.dispatch(loadToc())
    }
    // call getInitialProps from page
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Head>
          <title key="title">
            innoDoc web app
          </title>
        </Head>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

const nextReduxWrapperDebug = process.env.NODE_ENV !== 'production' && process.env.NEXT_REDUX_WRAPPER_DEBUG === 'true'
const withReduxConfig = { debug: nextReduxWrapperDebug }

// async here is important, otherwise next-redux-saga runs store.runSagaTask
// on every page navigation. (see #36)
const InnoDocAppWithReduxSaga = withReduxSaga({ async: true })(InnoDocApp)

export default withRedux(configureStore, withReduxConfig)(InnoDocAppWithReduxSaga)
