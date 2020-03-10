import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginOutlined } from '@ant-design/icons'

import { loginUser } from '@innodoc/client-misc/src/api'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'

import Link from '../Link'
import { EmailField, PasswordField } from './formFields'
import UserForm from './UserForm'

const ErrorDescription = () => (
  <Trans i18nKey="user.login.error.description">
    Please check your email and password.
    <br />
    <Link href="/request-password-reset">
      I don&apos;t remember my password
    </Link>
    <br />
    <br />
    Remember that you need to activate your account by clicking the link in your
    confirmation mail before you can login.
    <br />
    <Link href="/request-verification">Request confirmation mail</Link>
  </Trans>
)

const LoginForm = () => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email, password }, setDisabled, setMessage) =>
      loginUser(appRoot, csrfToken, email, password)
        .then(() => dispatch(userLoggedIn(email)))
        .catch(() => {
          setMessage({
            level: 'error',
            description: <ErrorDescription />,
            message: t('user.login.error.message'),
          })
          setDisabled(false)
        }),
    [appRoot, csrfToken, dispatch, t]
  )

  const extra = (
    <Trans i18nKey="user.login.orCreateAccount">
      or <Link href="/register">create new account</Link>.
    </Trans>
  )

  return (
    <UserForm
      extra={extra}
      name="login-form"
      onFinish={onFinish}
      submitIcon={<LoginOutlined />}
      submitText={t('user.login.signIn')}
    >
      {(disabled) => (
        <>
          <EmailField disabled={disabled} hasLabel={false} />
          <PasswordField disabled={disabled} hasLabel={false} />
        </>
      )}
    </UserForm>
  )
}

export default LoginForm
