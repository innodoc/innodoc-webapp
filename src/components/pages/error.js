import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

import { withNamespaces } from '../../lib/i18n'
import Layout from '../Layout'

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

export { ErrorPage as BareErrorPage } // for testing
export default withNamespaces(ErrorPage)
