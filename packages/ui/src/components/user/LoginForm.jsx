import { HomeOutlined, LoginOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Trans, useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import { loginUser } from '@innodoc/misc/api'
// import { userLoggedIn } from '@innodoc/store/actions/user'
import { selectCourse } from '@innodoc/store/selectors/content'

import Link from '../common/Link.jsx'
import ContentLink from '../content/links/ContentLink.jsx'

import EmailField from './formFields/EmailField.jsx'
import PasswordField from './formFields/PasswordField.jsx'
import UserForm from './UserForm.jsx'

function ErrorDescription() {
  return (
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
}

const loginUser = () => {}
const userLoggedIn = () => {}

function LoginForm() {
  const router = useRouter()
  const course = useSelector(selectCourse)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const csrfToken = '' // TODO
  const loggedInEmail = null

  const onFinish = useCallback(
    ({ email, password }, setDisabled, setMessage) =>
      loginUser(csrfToken, email, password)
        .then(() => {
          dispatch(userLoggedIn(email))
          // Honor redirect_to after login
          if (router.query.redirect_to) {
            window.location.replace(router.query.redirect_to)
          }
          return undefined
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
