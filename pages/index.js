import React from 'react'
import { connect } from 'react-redux'

import withI18next from '../lib/withI18next'
import Layout from '../components/Layout'
import Toc from '../components/Toc'

const IndexPage = () => (
  <Layout>
    <Toc vertical fluid size="massive" />
  </Layout>
)

export default connect()(withI18next()(IndexPage))
