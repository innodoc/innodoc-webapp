import React from 'react'
import { connect } from 'react-redux'

import Layout from '../Layout'

const AboutPage = () => (
  <Layout>
    <p>
      This is the about page
    </p>
  </Layout>
)

export { AboutPage } // for testing
export default connect()(AboutPage)
