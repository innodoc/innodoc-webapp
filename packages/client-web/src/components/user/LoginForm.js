import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Form, Input } from 'antd'
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

import { MESSAGE_TYPES_LOGIN } from '@innodoc/client-misc/src/messageDef'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { loginUser } from '@innodoc/client-store/src/actions/user'
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
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const extra = (
    <Trans i18nKey="user.login.orCreateAccount">
      or <CreateAccountLink />.
    </Trans>
  )

  const renderItems = (disabled) => (
    <>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('user.emailValidation.missing') },
          { type: 'email', message: t('user.emailValidation.invalid') },
        ]}
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
      extra={extra}
      formStateField="loginFormState"
      messageTypes={MESSAGE_TYPES_LOGIN}
      name="login-form"
      onFinish={({ email, password }) => dispatch(loginUser(email, password))}
      submitIcon={<LoginOutlined />}
      submitText={t('user.login.signIn')}
    >
      {renderItems}
    </UserForm>
  )
}

export default LoginForm
