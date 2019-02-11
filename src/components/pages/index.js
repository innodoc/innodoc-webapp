import React from 'react'
import { connect } from 'react-redux'

import withI18next from '../hoc/withI18next'
import withI18nDispatch from '../hoc/withI18nDispatch'
import Layout from '../Layout'
import Toc from '../Toc'

const IndexPage = () => (
  <Layout disableSidebar>
    <Toc expandAll />
  </Layout>
)

export { IndexPage } // for testing
export default connect()(
  withI18next()(
    withI18nDispatch(
      IndexPage
    )
  )
)
