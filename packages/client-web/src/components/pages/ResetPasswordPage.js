import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import ResetPasswordForm from '../user/ResetPasswordForm'

const ResetPasswordPage = ({ token }) => {
  const { t } = useTranslation()
  const title = t('user.resetPassword.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <ResetPasswordForm token={token} />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

ResetPasswordPage.getInitialProps = ({ query }) => ({ token: query.token })

ResetPasswordPage.propTypes = {
  token: PropTypes.string.isRequired,
}

export default ResetPasswordPage
