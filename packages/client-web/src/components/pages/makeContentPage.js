import React from 'react'
import { useSelector } from 'react-redux'
import MathJax from '@innodoc/react-mathjax-node'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'

import Layout from '../Layout'
import ErrorPage from './ErrorPage'

export default (ContentComponent, load) => {
  const ContentPage = () => {
    const { show404 } = useSelector(appSelectors.getApp)
    return show404 ? (
      <ErrorPage statusCode={404} />
    ) : (
      <Layout>
        <MathJax.Provider>
          <ContentComponent />
        </MathJax.Provider>
      </Layout>
    )
  }

  ContentPage.getInitialProps = ({ query, store }) => {
    const { language } = appSelectors.getApp(store.getState())
    store.dispatch(
      query.contentId ? load(query.contentId, language) : contentNotFound()
    )
    return {}
  }

  return ContentPage
}
