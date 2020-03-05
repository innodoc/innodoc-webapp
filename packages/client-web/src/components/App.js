import React from 'react'
import { connect, Provider } from 'react-redux'
import Head from 'next/head'
import App from 'next/app'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { insert } from 'mathjax-full/js/util/Options'
import MathJax from '@innodoc/react-mathjax-node'

import '@innodoc/client-web/src/style/lato-font.sss'

import { appWithTranslation } from '@innodoc/client-misc/src/i18n'
import rootSaga from '@innodoc/client-sagas'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import makeMakeStore from '@innodoc/client-store/src/store'
import {
  loadManifest,
  navigate,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'

const DEFAULT_MATHJAX_FONT_URL = `${
  process.browser ? window.location.origin : ''
}/fonts/mathjax-woff-v2`

const waitForCourse = (store) =>
  new Promise((resolve, reject) => {
    let course = courseSelectors.getCurrentCourse(store.getState())
    if (course) {
      resolve(course)
    } else {
      const unsubscribe = store.subscribe(() => {
        course = courseSelectors.getCurrentCourse(store.getState())
        if (course) {
          unsubscribe()
          resolve(course)
        } else {
          const { error } = appSelectors.getApp(store.getState())
          if (error) {
            unsubscribe()
            reject(error)
          }
        }
      })
    }
  })

class InnoDocApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if (ctx.req && ctx.res) {
      // ctx.req/ctx.res not present when statically exported
      // set initial content URLs (passed from server/app configuration)
      const {
        appRoot,
        contentRoot,
        staticRoot,
        sectionPathPrefix,
        pagePathPrefix,
      } = ctx.res.locals
      ctx.store.dispatch(
        setServerConfiguration(
          appRoot,
          contentRoot,
          staticRoot,
          sectionPathPrefix,
          pagePathPrefix
        )
      )
      // pass detected language to store
      if (ctx.req.i18n) {
        ctx.store.dispatch(languageDetected(ctx.req.i18n.language))
      }
      // load content manifest on start-up
      ctx.store.dispatch(loadManifest())
    }

    // build custom MathJax options
    const defaultMathJaxOptions = {
      chtml: { fontURL: DEFAULT_MATHJAX_FONT_URL },
    }
    let mathJaxOptions
    let course
    try {
      course = await Promise.race([
        waitForCourse(ctx.store),
        new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId)
            reject()
          }, 1000)
        }),
      ])
      mathJaxOptions = insert(
        defaultMathJaxOptions,
        course.mathJaxOptions,
        false
      )
    } catch (error) {
      mathJaxOptions = defaultMathJaxOptions
    }

    // page props
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return {
      pageProps: {
        ...pageProps,
        namespacesRequired: ['common'],
        mathJaxOptions,
      },
    }
  }

  render() {
    const { Component, dispatchNavigate, pageProps, store } = this.props

    // inform store about route changes
    Router.events.on('routeChangeStart', dispatchNavigate)

    return (
      <>
        <Head>
          <title key="title">innoDoc web app</title>
        </Head>
        <Provider store={store}>
          <MathJax.ConfigProvider options={pageProps.mathJaxOptions}>
            <Component statusCode={pageProps.statusCode} />
          </MathJax.ConfigProvider>
        </Provider>
      </>
    )
  }
}

const nextReduxWrapperDebug =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_REDUX_WRAPPER_DEBUG === 'true'
const withReduxConfig = { debug: nextReduxWrapperDebug }

export { InnoDocApp, waitForCourse } // for testing
export default withRedux(
  makeMakeStore(rootSaga),
  withReduxConfig
)(
  appWithTranslation(
    withReduxSaga(connect(null, { dispatchNavigate: navigate })(InnoDocApp))
  )
)
