import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useServerContext } from 'next-server-context'

import MathJax from '@innodoc/react-mathjax-node'

import { contentNotFound, loadPage, loadSection } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'

import { PageContent, SectionContent } from '../content'
import Layout from '../Layout'
import ErrorPage from './ErrorPage'

const contentFragmentRegex = new RegExp('^[A-Za-z0-9_:-]+$')

const contentTypes = {
  page: [PageContent, loadPage],
  section: [SectionContent, loadSection],
}

const ContentPage = ({ contentType }) => {
  const serverContext = useServerContext()
  const { show404 } = useSelector(appSelectors.getApp)
  const [ContentComponent] = contentTypes[contentType]

  if (show404) {
    if (serverContext) {
      serverContext.response.statusCode = 404
    }
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <MathJax.Provider>
        <ContentComponent />
      </MathJax.Provider>
    </Layout>
  )
}

ContentPage.getInitialProps = ({ query: { fragments, contentPrefix }, store }) => {
  const { language, pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(store.getState())
  const pathPrefixes = { page: pagePathPrefix, section: sectionPathPrefix }

  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
    if (
      fragments.every((f) => contentFragmentRegex.test(f)) &&
      ((contentType === 'page' && fragments.length === 1) || contentType === 'section')
    ) {
      const [, loadAction] = contentTypes[contentType]
      store.dispatch(loadAction(fragments.join('/'), language))
      return { contentType }
    }
  }

  store.dispatch(contentNotFound())
  return {}
}

ContentPage.propTypes = {
  contentType: PropTypes.oneOf(Object.keys(contentTypes)).isRequired,
}

export default ContentPage
