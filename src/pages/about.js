import React from 'react'
import { connect } from 'react-redux'

import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'

const AboutPage = () => (
  <Layout>
    <p>
      This is the about page
    </p>
  </Layout>
)

export default connect()(
  withI18next()(
    withI18nDispatch(
      AboutPage
    )
  )
)
