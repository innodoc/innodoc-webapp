import React from 'react'
import { Col, Row, Typography } from 'antd'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/common/src/i18n'

import withRequireAuth from './withRequireAuth'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import ChangePasswordForm from '../user/ChangePasswordForm'

const ChangePasswordPage = ({ children }) => {
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
        {children}
      </Layout>
    </>
  )
}

ChangePasswordPage.defaultProps = {
  children: null,
}

ChangePasswordPage.propTypes = {
  children: childrenType,
}

export { ChangePasswordPage } // for testing
export default withRequireAuth(ChangePasswordPage)
