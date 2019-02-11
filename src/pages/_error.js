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

    return (
      <Layout>
        <Alert
          message={title}
          description={msg}
          type={statusCode === 404 ? 'info' : 'error'}
          showIcon
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

export { ErrorPage as TestableErrorPage } // for testing
export default withI18next()(
  withI18nDispatch(
    ErrorPage
  )
)
