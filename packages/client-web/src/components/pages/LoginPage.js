import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Result, Row, Col } from 'antd'
import { HomeOutlined, LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Layout from '../Layout'
import LoginForm from '../user/LoginForm'
import { InternalLink } from '../content/links'
import css from '../content/style.sss'

const LoginPage = () => {
  const { t } = useTranslation()
  const { loggedInEmail } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)

  const content = loggedInEmail ? (
    <Result
      status="success"
      title={t('user.login.success.message')}
      subTitle={t('user.login.success.description')}
      extra={
        course ? (
          <InternalLink href={course.homeLink}>
            <Button icon={<HomeOutlined />} type="primary">
              {t('content.home')}
            </Button>
          </InternalLink>
        ) : null
      }
    />
  ) : (
    <>
      <h1 className={css.header}>
        <LoginOutlined /> {t('user.login.title')}
      </h1>
      <LoginForm />
    </>
  )

  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={16} md={12} lg={10}>
          {content}
        </Col>
      </Row>
    </Layout>
  )
}

export default LoginPage
