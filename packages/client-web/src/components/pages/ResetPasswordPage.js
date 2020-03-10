import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import ResetPasswordForm from '../user/ResetPasswordForm'
import css from '../content/style.sss'

const ResetPasswordPage = ({ token }) => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <Row justify="space-around" align="middle">
        <Col xs={24} sm={20} md={18} lg={16}>
          <h1 className={css.header}>{t('user.resetPassword.title')}</h1>
          <ResetPasswordForm token={token} />
        </Col>
      </Row>
    </Layout>
  )
}

ResetPasswordPage.getInitialProps = ({ query }) => ({ token: query.token })

ResetPasswordPage.propTypes = {
  token: PropTypes.string.isRequired,
}

export default ResetPasswordPage
