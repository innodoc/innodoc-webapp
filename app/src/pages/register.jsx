import { UserAddOutlined } from '@ant-design/icons'
import { Row, Col, Typography } from 'antd'
import { useTranslation } from 'next-i18next'

import PageTitle from '../common/PageTitle.js'
import Layout from '../Layout.js'
import getStaticPageProps from '../lib/getStaticPageProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'
import RegistrationForm from '../user/RegistrationForm.js'

function Register() {
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
export default Register
