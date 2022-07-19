import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Button, Result } from 'antd'
import { HomeOutlined, LoginOutlined } from '@ant-design/icons'
import { Trans, useTranslation } from 'next-i18next'

import { api } from '@innodoc/misc'
import { userLoggedIn } from '@innodoc/store/src/actions/user'
import appSelectors from '@innodoc/store/src/selectors'
import courseSelectors from '@innodoc/store/src/selectors/course'

import Link from '../common/Link'
import { ContentLink } from '../content/links'
import { EmailField, PasswordField } from './formFields'
import UserForm from './UserForm'

const ErrorDescription = () => (
  <Trans i18nKey="user.login.error.description">
    Please check your email and password.
    <br />
    <Link href="/request-password-reset">I don&apos;t remember my password</Link>
    <br />
    <br />
    Remember that you need to activate your account by clicking the link in your confirmation mail
    before you can login.
    <br />
    <Link href="/request-verification">Request confirmation mail</Link>
  </Trans>
)

const LoginForm = () => {
  const router = useRouter()
  const { csrfToken, loggedInEmail } = useSelector(appSelectors.getApp)
  const course = useSelector(courseSelectors.getCurrentCourse)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email, password }, setDisabled, setMessage) =>
      api
        .loginUser(csrfToken, email, password)
        .then(() => {
          dispatch(userLoggedIn(email))
          // Honor redirect_to after login
          if (router.query.redirect_to) {
            window.location.replace(router.query.redirect_to)
          }
        })
        .catch(() => {
          setMessage({
            level: 'error',
            description: <ErrorDescription />,
            message: t('user.login.error.message'),
          })
          setDisabled(false)
        }),
    [csrfToken, dispatch, router, t]
  )

  const result = loggedInEmail ? (
    <Result
      status="success"
      title={t('user.login.success.message')}
      subTitle={t('user.login.success.description')}
      extra={
        course ? (
          <ContentLink href={course.homeLink}>
            <Button icon={<HomeOutlined />} type="primary">
              {t('content.home')}
            </Button>
          </ContentLink>
        ) : null
      }
    />
  ) : null

  const extra = (
    <Trans i18nKey="user.login.orCreateAccount">
      or <Link href="/register">create new account</Link>.
    </Trans>
  )

  return (
    <>
      <UserForm
        hide={typeof loggedInEmail !== 'undefined'}
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
      {result}
    </>
  )
}

export default LoginForm
