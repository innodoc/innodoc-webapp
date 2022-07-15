import React from 'react'
import { Row, Col, Typography } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import Layout from '../components/Layout'
import PageTitle from '../components/common/PageTitle'
import LoginForm from '../components/user/LoginForm'

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

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default LoginPage
