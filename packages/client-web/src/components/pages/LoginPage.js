import React from 'react'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import LoginForm from '../user/LoginForm'
import css from '../content/style.sss'

const LoginPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <h1 className={css.header}>{t('user.loginTitle')}</h1>
      <LoginForm />
    </Layout>
  )
}

export default LoginPage
