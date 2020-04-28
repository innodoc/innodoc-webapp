import React from 'react'
import { Row, Col, Typography } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import LoginForm from '../user/LoginForm'

const LoginPage = () => {
  const { t } = useTranslation()
  const title = t('user.login.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={16} md={12} lg={10}>
            <Typography.Title>
              <LoginOutlined /> {title}
            </Typography.Title>
            <LoginForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default LoginPage
