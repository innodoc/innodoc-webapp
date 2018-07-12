import React from 'react'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import withI18next from '../components/hoc/withI18next'

const AboutPage = () => (
  <Layout>
    <p>
      This is the about page
    </p>
  </Layout>
)

export default connect()(withI18next()(AboutPage))
