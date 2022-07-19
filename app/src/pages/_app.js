import PropTypes from 'prop-types'
import Head from 'next/head'
// import withReduxSaga from 'next-redux-saga'
// import { END } from 'redux-saga'
// import MathJax from '@innodoc/react-mathjax-node'
// import withServerContext from 'next-server-context/withServerContext.mjs'
import { appWithTranslation } from 'next-i18next'

// Import antd stylesheet
import 'antd/dist/antd.less'

// TODO: does this work? is it needed?
import '@innodoc/app/src/style/lato-font.sss'
import '@innodoc/app/src/style/svg-icons-stroke.sss'
import '@innodoc/app/src/style/fix-code-wrap.sss'

import nextI18NextConfig from '../../next.config/next-i18next.config'
import nextReduxWrapper from '../store'
import PageTitle from '../components/common/PageTitle'
import useRouteNotifier from '../hooks/useRouteNotifier'
// import withServerVars from './withServerVars'
// import withLoadManifest from './withLoadManifest'
// import withMathJaxOptions from './withMathJaxOptions'
// import withNextRedux from './withNextRedux'
// import App from '../../../../store/src/models/App'

const InnoDocApp = ({ Component, pageProps }) => {
  useRouteNotifier() // Notify store about Next.js route changes
  return (
    <>
      <Head>
        <meta content="initial-scale=1.0, width=device-width" key="viewport" name="viewport" />
      </Head>
      <PageTitle />
      <Component
        {...pageProps} // eslint-disable-line react/jsx-props-no-spreading
      />
    </>
  )
}

// const InnoDocApp = ({ Component, mathJaxOptions, pageProps }) => {
//   useRouteNotifier() // Notify store about Next.js route changes
//   return (
//     <>
//       <Head>
//         <meta content="initial-scale=1.0, width=device-width" key="viewport" name="viewport" />
//       </Head>
//       <PageTitle />
//       <MathJax.ConfigProvider options={mathJaxOptions}>
//         <Component
//           {...pageProps} // eslint-disable-line react/jsx-props-no-spreading
//         />
//       </MathJax.ConfigProvider>
//     </>
//   )
// }

InnoDocApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  // mathJaxOptions: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
}

// InnoDocApp.getInitialProps = nextReduxWrapper.getInitialPageProps(
//   (store) =>
//     async ({ Component, ctx }) => {
//       const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

//       // Stop the saga if on server
//       if (ctx.req) {
//         store.dispatch(END)
//         await store.sagaTask.toPromise()
//       }

//       return {
//         pageProps: {
//           ...pageProps,
//           namespacesRequired: ['common'],
//         },
//       }
//     }
// )

// const hocs = [
//   withServerContext,
//   withMathJaxOptions,
//   ...(typeof window === 'undefined'
//     ? [
//         // Only server-side
//         withLoadManifest,
//         withServerVars,
//       ]
//     : []),
//   appWithTranslation,
//   withReduxSaga,
//   withNextRedux,
// ]

// if (typeof window === 'undefined') {
//   const localePath = path.resolve(__dirname, '..', '..', '..', '..', 'public', 'locales')
//   console.log(`App __dirname=${__dirname} localePath=${localePath}`)
//   nextI18NextConfig.i18n.localePath = localePath
// }

export { InnoDocApp } // for testing
// export default hocs.reduce((acc, hoc) => hoc(acc), InnoDocApp)
export default nextReduxWrapper.withRedux(appWithTranslation(InnoDocApp, nextI18NextConfig))
