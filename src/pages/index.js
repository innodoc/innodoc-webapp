import React from 'react'
import { connect } from 'react-redux'

import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'
import Toc from '../components/Toc'

const IndexPage = () => (
  <Layout disableSidebar>
    <Toc
      header="TODO: fill in course title"
      defaultExpandAll
      disableExpand
    />
  </Layout>
)

export default connect()(
  withI18next()(
    withI18nDispatch(
      IndexPage
    )
  )
)
