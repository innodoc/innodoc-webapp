import React from 'react'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import RegisterForm from '../user/RegisterForm'
import css from '../content/style.sss'

const RegisterPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <h1 className={css.header}>{t('user.registerTitle')}</h1>
      <RegisterForm />
    </Layout>
  )
}

export default RegisterPage
