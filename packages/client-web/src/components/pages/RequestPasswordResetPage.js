import React from 'react'
import { Row, Col, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import RequestPasswordResetForm from '../user/RequestPasswordResetForm'

const RequestPasswordResetPage = () => {
  const { t } = useTranslation()
  const title = t('user.requestPasswordReset.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <RequestPasswordResetForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default RequestPasswordResetPage
