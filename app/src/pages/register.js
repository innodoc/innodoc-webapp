import { Row, Col, Typography } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
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

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default RegistrationPage
