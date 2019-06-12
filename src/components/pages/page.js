import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadSection, loadSectionFailure } from '../../store/actions/content'
import appSelectors from '../../store/selectors'
import Layout from '../Layout'
import Content from '../content'
import ErrorPage from './error'

class CoursePage extends React.Component {
  static getInitialProps({ query, store }) {
    store.dispatch(
      query.sectionId
        ? loadSection(query.sectionId)
        : loadSectionFailure({ error: { statusCode: 404 } })
    )
    return {}
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

export { CoursePage } // for testing
export default connect(mapStateToProps)(CoursePage)
