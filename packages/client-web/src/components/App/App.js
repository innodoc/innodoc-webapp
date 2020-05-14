import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
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

import PageTitle from '../PageTitle'
import RouteNotifier from './RouteNotifier'
import withDispatchConfiguration from './withDispatchConfiguration'
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
      <RouteNotifier />
    </Provider>
  )
}

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

InnoDocApp.getInitialProps = async ({ Component, ctx }) => {
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
      withDispatchConfiguration(
        appWithTranslation(withReduxSaga(withServerContext(InnoDocApp)))
      )
    )
  )
)
