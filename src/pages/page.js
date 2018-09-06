import React from 'react'
import { connect } from 'react-redux'

import { loadSection } from '../store/actions/content'
import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'
import Content from '../components/content/Content'

class CoursePage extends React.Component {
  static getInitialProps({ query, store }) {
    store.dispatch(loadSection(query.sectionPath))
  }

  render() {
    return (
      <Layout sidebar>
        <Content />
      </Layout>
    )
  }
}

export default connect()(withI18next()(withI18nDispatch(CoursePage)))
