import React from 'react'
import { useSelector } from 'react-redux'
import MathJax from '@innodoc/react-mathjax-node'
import { useServerContext } from 'next-server-context'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'

import Layout from '../Layout'
import ErrorPage from './ErrorPage'

const contentFragmentRegex = new RegExp('[A-Za-z0-9_:-]')

const makeContentPage = (ContentComponent, load) => {
  const ContentPage = () => {
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

  ContentPage.getInitialProps = ({ query, store }) => {
    console.log('here')
    let { contentId } = query
    console.log(contentId)
    if (Array.isArray(contentId)) {
      if (contentId.some((fragment) => !contentFragmentRegex.test(fragment))) {
        store.dispatch(contentNotFound())
        return {}
      }
      contentId = contentId.join('/')
    } else if (!contentFragmentRegex.test(contentId)) {
      store.dispatch(contentNotFound())
      return {}
    }
    const { language } = appSelectors.getApp(store.getState())
    console.log(contentId)
    store.dispatch(load(contentId, language))
    return {}
  }

  return ContentPage
}

export default makeContentPage
