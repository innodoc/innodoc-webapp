import React from 'react'
import { Row, Col, Typography } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import RegistrationForm from '../user/RegistrationForm'

const RegistrationPage = () => {
  const { t } = useTranslation()
  const title = t('user.registration.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>
              <UserAddOutlined /> {title}
            </Typography.Title>
            <RegistrationForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default RegistrationPage
