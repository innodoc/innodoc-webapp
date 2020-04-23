import React from 'react'
import { Row, Col } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import LoginForm from '../user/LoginForm'
import css from '../content/style.sss'

const LoginPage = () => {
  const { t } = useTranslation()
  const title = t('user.login.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={16} md={12} lg={10}>
            <h1 className={css.header}>
              <LoginOutlined /> {title}
            </h1>
            <LoginForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default LoginPage
