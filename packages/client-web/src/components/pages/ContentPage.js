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

const contentFragmentRegex = new RegExp('[A-Za-z0-9_:-]')

const contentTypes = {
  page: [PageContent, loadPage],
  section: [SectionContent, loadSection],
}

const ContentPage = ({ ContentComponent }) => {
  const serverContext = useServerContext()
  const { show404 } = useSelector(appSelectors.getApp)

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
  console.log('ContentPage.getInitialProps')
  const { language, pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(store.getState())
  console.log(pagePathPrefix, sectionPathPrefix)

  const pathPrefixes = { page: pagePathPrefix, section: sectionPathPrefix }

  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    if (fragments.every((f) => contentFragmentRegex.test(f))) {
      const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
      const [ContentComponent, loadAction] = contentTypes[contentType]
      const actionContentId = contentType === 'section' ? fragments.join('/') : fragments[0]
      store.dispatch(loadAction(actionContentId, language))
      return { ContentComponent }
    }
  }

  store.dispatch(contentNotFound())
  return {}
}

ContentPage.getInitialProps = ({ query: { fragments, contentPrefix }, store }) => {
  console.log('ContentPage.getInitialProps')
  const { language, pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(store.getState())
  console.log(pagePathPrefix, sectionPathPrefix)

  const pathPrefixes = { page: pagePathPrefix, section: sectionPathPrefix }

  if (Object.keys(pathPrefixes).includes(contentPrefix)) {
    if (fragments.every((f) => contentFragmentRegex.test(f))) {
      const contentType = contentPrefix === pathPrefixes.page ? 'page' : 'section'
      const [ContentComponent, loadAction] = contentTypes[contentType]
      const actionContentId = contentType === 'section' ? fragments.join('/') : fragments[0]
      store.dispatch(loadAction(actionContentId, language))
      return { ContentComponent }
    }
  }

  store.dispatch(contentNotFound())
  return {}
}

ContentPage.defaultProps = {
  ContentComponent: () => null,
}

ContentPage.propTypes = {
  ContentComponent: PropTypes.elementType,
}

export default ContentPage
