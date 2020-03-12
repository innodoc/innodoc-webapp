import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Form, Input } from 'antd'
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

import { loginUser } from '@innodoc/client-misc/src/api'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'

import UserForm from './UserForm'

const CreateAccountLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/register">
      <a>{t('user.registration.createAccount')}</a>
    </Link>
  )
}

const LoginForm = () => {
  const { appRoot } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [message, setMessage] = useState()
  const [disabled, setDisabled] = useState(false)

  const onFinish = ({ email, password }) => {
    setDisabled(true)
    loginUser(appRoot, email, password)
      .then(() => dispatch(userLoggedIn(email)))
      .catch(() => {
        setMessage({
          afterClose: () => setMessage(),
          level: 'error',
          description: t('user.login.fail.description'),
          message: t('user.login.fail.message'),
        })
        setDisabled(false)
      })
  }

  const extra = (
    <Trans i18nKey="user.login.orCreateAccount">
      or <CreateAccountLink />.
    </Trans>
  )

  const items = (
    <>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('user.emailValidation.missing') },
          { type: 'email', message: t('user.emailValidation.invalid') },
        ]}
        validateFirst
      >
        <Input
          disabled={disabled}
          prefix={<UserOutlined />}
          placeholder={t('user.email')}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: t('user.passwordValidation.missing') },
        ]}
      >
        <Input
          disabled={disabled}
          prefix={<LockOutlined />}
          type="password"
          placeholder={t('user.password')}
        />
      </Form.Item>
    </>
  )

  return (
    <UserForm
      disabled={disabled}
      extra={extra}
      message={message}
      name="login-form"
      onFinish={onFinish}
      submitIcon={<LoginOutlined />}
      submitText={t('user.login.signIn')}
    >
      {items}
    </UserForm>
  )
}

export default LoginForm
