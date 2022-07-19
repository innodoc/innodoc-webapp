import { Row, Col, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import RequestVerificationForm from '../user/RequestVerificationForm'

const RequestVerificationPage = () => {
  const { t } = useTranslation()
  const title = t('user.requestVerification.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <RequestVerificationForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default RequestVerificationPage
