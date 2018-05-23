import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'

import configureStore from '../store'
import { loadToc } from '../store/actions/content'

class InnoDocApp extends App {
  static async getInitialProps({ Component, ctx }) {
    // initially load TOC
    ctx.store.dispatch(loadToc())

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
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

const nextReduxWrapperDebug = process.env.NODE_ENV !== 'production' && process.env.NEXT_REDUX_WRAPPER_DEBUG === 'true'
const withReduxConfig = { debug: nextReduxWrapperDebug }
export default withRedux(configureStore, withReduxConfig)(withReduxSaga(InnoDocApp))
