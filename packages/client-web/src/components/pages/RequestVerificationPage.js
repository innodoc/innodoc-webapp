import React from 'react'
import { Row, Col } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import RequestVerificationForm from '../user/RequestVerificationForm'
import css from '../content/style.sss'

const RequestVerificationPage = () => {
  const { t } = useTranslation()
  const title = t('user.requestVerification.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <h1 className={css.header}>{title}</h1>
            <RequestVerificationForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default RequestVerificationPage
