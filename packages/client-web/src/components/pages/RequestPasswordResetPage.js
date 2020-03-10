import React from 'react'
import { Row, Col } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import RequestPasswordResetForm from '../user/RequestPasswordResetForm'
import css from '../content/style.sss'

const RequestPasswordResetPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={20} md={18} lg={16}>
          <h1 className={css.header}>{t('user.requestPasswordReset.title')}</h1>
          <RequestPasswordResetForm />
        </Col>
      </Row>
    </Layout>
  )
}

export default RequestPasswordResetPage
