import { Col, Row, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import useRequireLogin from '../../hooks/useRequireLogin'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import ChangePasswordForm from '../user/ChangePasswordForm'

const ChangePasswordPage = () => {
  useRequireLogin()
  const { t } = useTranslation()
  const title = t('user.changePassword.title')

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <ChangePasswordForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default ChangePasswordPage
