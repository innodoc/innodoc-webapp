import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadSection, loadSectionFailure } from '../store/actions/content'
import appSelectors from '../store/selectors/app'
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
      return (
        <ErrorPage statusCode={err.statusCode} />
      )
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
  err: PropTypes.shape({
    statusCode: PropTypes.number.isRequired,
  }),
}

const mapStateToProps = state => ({
  err: appSelectors.getError(state),
})

export default connect(mapStateToProps)(
  withI18next()(
    withI18nDispatch(
      CoursePage
    )
  )
)
