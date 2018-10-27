import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

import withI18next from '../components/hoc/withI18next'
import withI18nDispatch from '../components/hoc/withI18nDispatch'
import Layout from '../components/Layout'

class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    const props = {}
    if (res) {
      props.statusCode = res.statusCode
    }
    if (err) {
      props.statusCode = err.statusCode
    }
    return props
  }

  render() {
    const { t, statusCode } = this.props
    const title = t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])
    const msg = t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])
    const messageProps = statusCode === 404
      ? {
        warning: true,
        icon: 'exclamation circle',
      }
      : {
        error: true,
        icon: 'bug',
      }

    return (
      <Layout>
        <Alert
          message={title}
          description={msg}
          type="error"
          {...messageProps}
        />
      </Layout>
    )
  }
}

ErrorPage.defaultProps = { statusCode: null }

ErrorPage.propTypes = {
  statusCode: PropTypes.number,
  t: PropTypes.func.isRequired,
}

export default withI18next()(
  withI18nDispatch(
    ErrorPage
  )
)
