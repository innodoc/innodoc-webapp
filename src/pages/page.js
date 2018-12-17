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
      if (query.hash) {
        props.hash = query.hash
      }
    } else {
      props.err = { statusCode: 404 }
    }
    return props
  }

  componentDidMount() {
    const { hash } = this.props
    console.log('componentDidMount')
    if (hash) {
      console.log('mount, hash', hash)
      // scrollToComponent(this.Blue, { duration: 500 })
    }
  }

  componentDidUpdate() {
    if (document) {
      const { hash } = this.props
      console.log('componentDidUpdate')
      if (hash) {
        console.log('mount, hash', hash)
        // scrollToComponent(this.Blue, { duration: 500 })
        var el = document.getElementById(hash.slice(1))
        if (el)
          el.scrollIntoView()
      }
    }
    else {
      console.log('ON SERVER!')
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
