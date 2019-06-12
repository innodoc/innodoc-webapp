import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

import Layout from '../Layout'

class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    if (res) {
      return { statusCode: res.statusCode }
    }
    if (err) {
      return { statusCode: err.statusCode }
    }
    return {}
  }

  render() {
    const { statusCode } = this.props
    const descr = statusCode === 404
      ? 'This page could not be found.'
      : 'An error occured.'
    return (
      <Layout>
        <Alert
          message="Error"
          description={descr}
          type={statusCode === 404 ? 'info' : 'error'}
          showIcon
        />
      </Layout>
    )
  }
}

ErrorPage.defaultProps = {
  statusCode: null,
}

ErrorPage.propTypes = {
  statusCode: PropTypes.number,
}

export default ErrorPage
