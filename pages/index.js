import React from 'react'
import {connect} from 'react-redux'

import Layout from '../components/layout'
import PageLink from '../components/PageLink'

const IndexPage = () => (
  <Layout>
    <h1>innoDoc</h1>
    <p>
      PageLink: <PageLink id="vbkm01"><a>Kapitel 1</a></PageLink>
    </p>
  </Layout>
)

export default connect()(IndexPage)
