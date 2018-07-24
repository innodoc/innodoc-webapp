import React from 'react'
import { connect } from 'react-redux'

import { loadSection } from '../store/actions/content'
import withI18next from '../components/hoc/withI18next'
import withReduxI18nextSync from '../components/hoc/withReduxI18nextSync'
import Layout from '../components/Layout'
import Content from '../components/content/Content'

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

export default connect()(withI18next()(withReduxI18nextSync(CoursePage)))
