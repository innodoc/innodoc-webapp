import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'

const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <Alert
        message={t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])}
        description={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
        type={statusCode === 404 ? 'info' : 'error'}
        showIcon
      />
    </Layout>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  if (res) {
    return { statusCode: res.statusCode }
  }
  if (err) {
    return { statusCode: err.statusCode }
  }
  return {}
}
ErrorPage.defaultProps = { statusCode: null }
ErrorPage.propTypes = { statusCode: PropTypes.number }

export default ErrorPage
