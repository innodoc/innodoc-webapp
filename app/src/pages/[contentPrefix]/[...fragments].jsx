import PropTypes from 'prop-types'
// import { useSelector } from 'react-redux'
// import useServerContext from 'next-server-context/useServerContext.mjs'

import getContentComponentAndLoadAction, {
  contentTypes,
} from '@innodoc/misc/getContentComponentAndLoadAction'
import MathJax from '@innodoc/react-mathjax-node'
// import { getApp } from '@innodoc/store/misc'
import Layout from '@innodoc/ui/layout'
// import ErrorPage from './ErrorPage'

import getStaticPaths from '../../lib/content/getStaticPaths.js'
import getStaticContentProps from '../../lib/content/getStaticProps.js'
import serversideBootstrap from '../../lib/serversideBootstrap.js'

function ContentPage({ contentType }) {
  // const serverContext = useServerContext()
  // const { show404 } = useSelector(getApp)

  // if (show404) {
  //   if (serverContext) {
  //     serverContext.response.statusCode = 404
  //   }
  //   return <ErrorPage statusCode={404} />
  // }

  const { Component } = getContentComponentAndLoadAction(contentType)
  // console.log('ContentPage ContentComponent=', ContentComponent.name)

  return (
    <Layout>
      <MathJax.Provider>
        <Component />
      </MathJax.Provider>
    </Layout>
  )
}

ContentPage.propTypes = {
  contentType: PropTypes.oneOf(contentTypes).isRequired,
}

const getStaticProps = serversideBootstrap(getStaticContentProps)

export { getStaticPaths, getStaticProps }
export default ContentPage
