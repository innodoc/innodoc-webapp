import React from 'react'
import { connect } from 'react-redux'

import withI18next from '../hoc/withI18next'
import withI18nDispatch from '../hoc/withI18nDispatch'
import Layout from '../Layout'

const AboutPage = () => (
  <Layout>
    <p>
      This is the about page
    </p>
  </Layout>
)

export { AboutPage } // for testing
export default connect()(
  withI18next()(
    withI18nDispatch(
      AboutPage
    )
  )
)
