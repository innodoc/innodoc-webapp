import React from 'react'
import {connect} from 'react-redux'

import Layout from '../components/Layout'
import PageLink from '../components/PageLink'
import withI18next from '../lib/withI18next'

const IndexPage = () => (
  <Layout>
    <h1>innoDoc</h1>
    <ul>
      <li>
        <PageLink pageSlug="vbkm01"><a>Kapitel 1</a></PageLink>
      </li>
      <li>
        <PageLink pageSlug="test"><a>Test</a></PageLink>
      </li>
    </ul>
  </Layout>
)

export default connect()(withI18next()(IndexPage))
