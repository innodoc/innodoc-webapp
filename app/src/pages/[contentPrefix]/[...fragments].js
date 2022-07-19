import PropTypes from 'prop-types'
// import { useSelector } from 'react-redux'
// import useServerContext from 'next-server-context/useServerContext.mjs'
import MathJax from '@innodoc/react-mathjax-node'

// import appSelectors from '@innodoc/store/src/selectors'

import Layout from '../../components/Layout'
// import ErrorPage from './ErrorPage'

import contentTypes from '../../lib/content/contentTypes.js'
import getStaticPaths from '../../lib/content/getStaticPaths'
import getStaticContentProps from '../../lib/content/getStaticProps'
import serversideBootstrap from '../../lib/serversideBootstrap'

const ContentPage = ({ contentType }) => {
  // const serverContext = useServerContext()
  // const { show404 } = useSelector(appSelectors.getApp)

  // if (show404) {
  //   if (serverContext) {
  //     serverContext.response.statusCode = 404
  //   }
  //   return <ErrorPage statusCode={404} />
  // }

  const [ContentComponent] = contentTypes[contentType]
  // console.log('ContentPage ContentComponent=', ContentComponent.name)

  return (
    <Layout>
      <MathJax.Provider>
        <ContentComponent />
      </MathJax.Provider>
    </Layout>
  )
}

ContentPage.propTypes = {
  contentType: PropTypes.oneOf(Object.keys(contentTypes)).isRequired,
}

const getStaticProps = serversideBootstrap(getStaticContentProps)

export { getStaticPaths, getStaticProps }
export default ContentPage
