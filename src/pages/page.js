import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadSection, loadSectionFailure } from '../store/actions/content'
import appSelectors from '../store/selectors'
import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'
import Content from '../components/content/Content'
import ErrorPage from './_error'

class CoursePage extends React.Component {
  static getInitialProps({ query, store }) {
    const props = {}
    if (query.sectionId) {
      store.dispatch(loadSection(query.sectionId))
    } else {
      store.dispatch(loadSectionFailure({ error: { statusCode: 404 } }))
    }
    return props
  }

  render() {
    const { err } = this.props

    if (err) {
      // workaround for setting the status code (client and server)
      // https://github.com/zeit/next.js/issues/4451#issuecomment-438096614
      if (process.browser) {
        return (
          <ErrorPage statusCode={err.statusCode} />
        )
      }
      const e = new Error()
      e.code = 'ENOENT'
      throw e
    }

    return (
      <Layout>
        <Content />
      </Layout>
    )
  }
}

CoursePage.defaultProps = { err: null }

CoursePage.propTypes = {
  err: PropTypes.shape({ statusCode: PropTypes.number }),
}

const mapStateToProps = state => ({
  err: appSelectors.getApp(state).error,
})

export default connect(mapStateToProps)(
  withI18next()(
    withI18nDispatch(
      CoursePage
    )
  )
)
