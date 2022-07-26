import { Row, Col, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import RequestPasswordResetForm from '../user/RequestPasswordResetForm'

const RequestPasswordReset = () => {
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

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default RequestPasswordReset
