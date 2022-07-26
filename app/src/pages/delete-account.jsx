import { Col, Row, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'
import useRequireLogin from '../hooks/useRequireLogin'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/common/PageTitle'
import DeleteAccountForm from '../components/user/DeleteAccountForm'

function DeleteAccount() {
  useRequireLogin()
  const { t } = useTranslation()
  const title = t('user.deleteAccount.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={20} md={18} lg={16}>
            <Typography.Title>{title}</Typography.Title>
            <DeleteAccountForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default DeleteAccount
