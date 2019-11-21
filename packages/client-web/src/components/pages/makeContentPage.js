import React from 'react'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import MathJaxProvider from '../../mathjax/MathJaxProvider'
import Layout from '../Layout'
import ErrorPage from './ErrorPage'

export default (ContentComponent, load, loadFailure) => {
  const ContentPage = () => {
    const { error } = useSelector(appSelectors.getApp)
    const { mathjaxOptions } = useSelector(courseSelectors.getCurrentCourse)

    if (error) {
      // workaround for setting the status code (client and server)
      // https://github.com/zeit/next.js/issues/4451#issuecomment-438096614
      if (process.browser) {
        return <ErrorPage statusCode={error.statusCode} />
      }
      const e = new Error()
      e.code = 'ENOENT'
      throw e
    }

    return (
      <Layout>
        <MathJaxProvider options={mathjaxOptions}>
          {(typesettingDone) => <ContentComponent typesettingDone={typesettingDone} />}
        </MathJaxProvider>
      </Layout>
    )
  }

  ContentPage.getInitialProps = ({ query, store }) => {
    const { language } = appSelectors.getApp(store.getState())
    store.dispatch(
      query.contentId
        ? load(query.contentId, language)
        : loadFailure({ error: { statusCode: 404 } })
    )
    return {}
  }

  return ContentPage
}
