import React from 'react'
import { useSelector } from 'react-redux'

import { loadSection, loadSectionFailure } from '../../store/actions/content'
import appSelectors from '../../store/selectors'
import Layout from '../Layout'
import Content from '../content'
import ErrorPage from './error'

const CoursePage = () => {
  const { error } = useSelector(appSelectors.getApp)

  if (error) {
    // workaround for setting the status code (client and server)
    // https://github.com/zeit/next.js/issues/4451#issuecomment-438096614
    if (process.browser) {
      return (
        <ErrorPage statusCode={error.statusCode} />
      )
    }
    const e = new Error()
    e.code = 'ENOENT'
    throw e
  }

  return (
    <Layout>
      <Content />
    </Layout>
  )
}

CoursePage.getInitialProps = ({ query, store }) => {
  store.dispatch(
    query.sectionId
      ? loadSection(query.sectionId)
      : loadSectionFailure({ error: { statusCode: 404 } })
  )
  return {}
}

export default CoursePage
