import React from 'react'
import { connect } from 'react-redux'
import { tocTreeType } from '../lib/propTypes'

import { selectors as contentSelectors } from '../store/reducers/content'
import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'
import Toc from '../components/Toc'

const IndexPage = ({ toc }) => (
  <Layout>
    <Toc vertical fluid secondary size="massive" toc={toc} />
  </Layout>
)

IndexPage.propTypes = {
  toc: tocTreeType.isRequired,
}

const mapStateToProps = state => ({ toc: contentSelectors.getToc(state) })

export default connect(mapStateToProps)(withI18next()(withI18nDispatch(IndexPage)))