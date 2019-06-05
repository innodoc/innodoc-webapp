import React from 'react'
import { connect } from 'react-redux'

import Layout from '../Layout'
import Toc from '../Toc'

const IndexPage = () => (
  <Layout disableSidebar>
    <Toc expandAll />
  </Layout>
)

export { IndexPage } // for testing
export default connect()(IndexPage)
