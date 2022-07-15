import React from 'react'
import { Col, Row, Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import useRequireLogin from '../../hooks/useRequireLogin'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import DeleteAccountForm from '../user/DeleteAccountForm'

const DeleteAccountPage = () => {
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

export default DeleteAccountPage
