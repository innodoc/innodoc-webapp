import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useServerContext from 'next-server-context/useServerContext.mjs'

import MathJax from '@innodoc/react-mathjax-node'

import appSelectors from '@innodoc/client-store/src/selectors'

import contentTypes from '../../lib/contentTypes'
import Layout from '../Layout'
import ErrorPage from './ErrorPage'

const ContentPage = ({ contentType }) => {
  const serverContext = useServerContext()
  const { show404 } = useSelector(appSelectors.getApp)

  if (show404) {
    if (serverContext) {
      serverContext.response.statusCode = 404
    }
    return <ErrorPage statusCode={404} />
  }

  const [ContentComponent] = contentTypes[contentType]

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

export default ContentPage
