import React from 'react'
import {connect} from 'react-redux'

import Layout from '../components/Layout'
import withI18next from '../lib/withI18next'

class AboutPage extends React.Component {
  render() {
    return <Layout>
      <p>This is the about page</p>
    </Layout>
  }
}

export default connect()(withI18next()(AboutPage))
