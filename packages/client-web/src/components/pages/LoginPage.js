import React from 'react'
import { Row, Col } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import LoginForm from '../user/LoginForm'
import css from '../content/style.sss'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={16} md={12} lg={10}>
          <h1 className={css.header}>
            <LoginOutlined /> {t('user.login.title')}
          </h1>
          <LoginForm />
        </Col>
      </Row>
    </Layout>
  )
}

export default LoginPage
