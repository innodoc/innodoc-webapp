import React from 'react'
import { Row, Col } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import RegistrationForm from '../user/RegistrationForm'
import css from '../content/style.sss'

const RegistrationPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={20} md={18} lg={16}>
          <h1 className={css.header}>
            <UserAddOutlined /> {t('user.registration.title')}
          </h1>
          <RegistrationForm />
        </Col>
      </Row>
    </Layout>
  )
}

export default RegistrationPage
