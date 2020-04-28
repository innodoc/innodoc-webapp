import React from 'react'
import { Col, Row, Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import ChangePasswordForm from '../user/ChangePasswordForm'

const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const title = t('user.changePassword.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <ChangePasswordForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default ChangePasswordPage
