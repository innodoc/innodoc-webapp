import React from 'react'
import { connect } from 'react-redux'

import { loadSection } from '../store/actions/content'
import withI18next from '../lib/withI18next'
import Layout from '../components/Layout'
import Content from '../components/Content'

class CoursePage extends React.Component {
  static getInitialProps({ query, store }) {
    store.dispatch(loadSection(query.sectionId))
  }

  render() {
    return (
      <Layout sidebar>
        <Content />
      </Layout>
    )
  }
}

export default connect()(withI18next()(CoursePage))
