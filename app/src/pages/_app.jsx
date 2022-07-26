// import MathJax from '@innodoc/react-mathjax-node'
import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'
import PropTypes from 'prop-types'

// Import antd stylesheet
import 'antd/dist/antd.less'

import '@innodoc/ui/style/global.sss'

import { PageTitle } from '@innodoc/ui/common'
// import { useRouteNotifier } from '@innodoc/ui/hooks'

// import nextI18NextConfig from '../../next.config/next-i18next.config.js'
import nextReduxWrapper from '../lib/nextReduxWrapper.js'
// import withServerVars from './withServerVars'
// import withLoadManifest from './withLoadManifest'
// import withMathJaxOptions from './withMathJaxOptions'
// import withNextRedux from './withNextRedux'
// import App from '../../../../store/src/models/App'

function InnoDocApp({ Component, pageProps }) {
  // useRouteNotifier() // Notify store about Next.js route changes

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

export { InnoDocApp } // for testing
// export default hocs.reduce((acc, hoc) => hoc(acc), InnoDocApp)
// export default nextReduxWrapper.withRedux(appWithTranslation(InnoDocApp, nextI18NextConfig))
export default nextReduxWrapper.withRedux(appWithTranslation(InnoDocApp))
