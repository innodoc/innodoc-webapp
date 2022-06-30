import React from 'react'
import PropTypes from 'prop-types'
import { Result } from 'antd'

import { useTranslation } from 'next-i18next'

import HomeButton from '../HomeButton'
import Layout from '../Layout'
import PageTitle from '../PageTitle'

const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation()
  const title = t([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <Result
          status={statusCode.toString()}
          title={title}
          subTitle={t([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])}
          extra={<HomeButton />}
        />
      </Layout>
    </>
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
ErrorPage.defaultProps = { statusCode: 500 }
ErrorPage.propTypes = { statusCode: PropTypes.number }

export default ErrorPage
