import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { insert } from 'mathjax-full/js/util/Options'
import MathJax from '@innodoc/react-mathjax-node'
import { withServerContext } from 'next-server-context'

import '@innodoc/client-web/src/style/lato-font.sss'

import { appWithTranslation } from '@innodoc/client-misc/src/i18n'
import rootSaga from '@innodoc/client-sagas'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import makeMakeStore from '@innodoc/client-store/src/store'
import {
  loadManifest,
  routeChangeStart,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import PageTitle from '../PageTitle'
import withIndexRedirect from './withIndexRedirect'
import withWaitForManifest from './withWaitForManifest'

const DEFAULT_MATHJAX_FONT_URL = `${
  process.browser ? window.location.origin : ''
}/fonts/mathjax-woff-v2`

const InnoDocApp = ({ Component, pageProps, store }) => {
  const { mathJaxOptions, ...pagePropsRest } = pageProps

  return (
    <Provider store={store}>
      <PageTitle />
      <MathJax.ConfigProvider options={mathJaxOptions}>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...pagePropsRest}
        />
      </MathJax.ConfigProvider>
    </Provider>
  )
}

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

InnoDocApp.getInitialProps = async ({ Component, ctx }) => {
  const { dispatch } = ctx.store

  // on server
  if (ctx.req && ctx.res) {
    // Set initial content URLs (passed from server/app configuration)
    const {
      appRoot,
      contentRoot,
      staticRoot,
      sectionPathPrefix,
      pagePathPrefix,
    } = ctx.res.locals
    dispatch(
      setServerConfiguration(
        appRoot,
        contentRoot,
        staticRoot,
        ctx.req.csrfToken(),
        sectionPathPrefix,
        pagePathPrefix
      )
    )

    // Pass detected language to store
    if (ctx.req.i18n) {
      dispatch(languageDetected(ctx.req.i18n.language))
    }

    // Load content manifest on start-up
    dispatch(loadManifest())

    // Server verified access token
    if (ctx.res.locals.loggedInEmail) {
      dispatch(userLoggedIn(ctx.res.locals.loggedInEmail))
    }
  }
  // on client
  else {
    // Notify store about route changes
    Router.events.on('routeChangeStart', () => dispatch(routeChangeStart()))
  }

  // Build custom MathJax options
  const course = courseSelectors.getCurrentCourse(ctx.store.getState())
  const defaultMathJaxOptions = {
    chtml: { fontURL: DEFAULT_MATHJAX_FONT_URL },
  }
  let mathJaxOptions
  try {
    mathJaxOptions = insert(defaultMathJaxOptions, course.mathJaxOptions, false)
  } catch (error) {
    mathJaxOptions = defaultMathJaxOptions
  }

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

export { InnoDocApp } // for testing
export default withRedux(makeMakeStore(rootSaga))(
  withWaitForManifest(
    withIndexRedirect(
      appWithTranslation(withReduxSaga(withServerContext(InnoDocApp)))
    )
  )
)
