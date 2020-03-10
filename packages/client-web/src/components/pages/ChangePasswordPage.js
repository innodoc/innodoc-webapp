import React from 'react'
import { Row, Col } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import ChangePasswordForm from '../user/ChangePasswordForm'
import css from '../content/style.sss'

const ChangePasswordPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={20} md={18} lg={16}>
          <h1 className={css.header}>{t('user.changePassword.title')}</h1>
          <ChangePasswordForm />
        </Col>
      </Row>
    </Layout>
  )
}

export default ChangePasswordPage
