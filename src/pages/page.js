import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadSection } from '../store/actions/content'
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
      props.err = { statusCode: 404 }
    }
    if (query.hash) {
      props.hash = query.hash
    }
    return props
  }

  componentDidMount() {
    const hash = this.props
    if (hash) {
      scrollToComponent(this.Blue, { duration: 500 })
    }
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

CoursePage.defaultProps = {
  err: null,
  hash: null,
}

CoursePage.propTypes = {
  err: PropTypes.shape({
    statusCode: PropTypes.number.isRequired,
  }),
  hash: PropTypes.string,
}

export default connect()(
  withI18next()(
    withI18nDispatch(
      CoursePage
    )
  )
)
