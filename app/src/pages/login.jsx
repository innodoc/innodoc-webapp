import { LoginOutlined } from '@ant-design/icons'
import { Row, Col, Typography } from 'antd'
import { useTranslation } from 'next-i18next'

import { PageTitle } from '@innodoc/ui/common'
import Layout from '@innodoc/ui/layout'
import { LoginForm } from '@innodoc/ui/user'

import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'

function Login() {
  const { t } = useTranslation()
  const title = t('user.login.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Row justify="space-around" align="middle">
          <Col xs={24} sm={16} md={12} lg={10}>
            <Typography.Title>
              <LoginOutlined /> {title}
            </Typography.Title>
            <LoginForm />
          </Col>
        </Row>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default Login
