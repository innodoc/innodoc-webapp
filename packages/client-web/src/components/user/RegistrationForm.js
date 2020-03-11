import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Form, Input } from 'antd'
import { MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons'

import { MESSAGE_TYPES_REGISTER } from '@innodoc/client-misc/src/messageDef'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { registerUser } from '@innodoc/client-store/src/actions/user'
import UserForm from './UserForm'

const LoginLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/login">
      <a>{t('user.signIn')}</a>
    </Link>
  )
}

const RegistrationForm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const extra = (
    <Trans i18nKey="user.orLogin">
      or <LoginLink /> if you already have an account.
    </Trans>
  )

  const renderItems = (disabled) => (
    <>
      <Form.Item
        label={t('user.email')}
        name="email"
        rules={[
          { type: 'email', message: t('user.emailInvalid') },
          { required: true, message: t('user.emailMissing') },
        ]}
      >
        <Input disabled={disabled} prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        label={t('user.password')}
        name="password"
        rules={[{ required: true, message: t('user.passwordMissing') }]}
      >
        <Input.Password disabled={disabled} prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        dependencies={['password']}
        hasFeedback
        label={t('user.confirmPassword')}
        name="confirm"
        rules={[
          {
            required: true,
            message: t('user.pleaseConfirmPassword'),
          },
          ({ getFieldValue }) => ({
            validator: (rule, value) =>
              !value || getFieldValue('password') === value
                ? Promise.resolve()
                : Promise.reject(new Error(t('user.passwordMismatch'))),
          }),
        ]}
      >
        <Input.Password disabled={disabled} prefix={<LockOutlined />} />
      </Form.Item>
    </>
  )

  return (
    <UserForm
      extra={extra}
      formStateField="registrationFormState"
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
      messageTypes={MESSAGE_TYPES_REGISTER}
      name="registration-form"
      onFinish={({ email, password }) =>
        dispatch(registerUser(email, password))
      }
      submitIcon={<UserAddOutlined />}
      submitText={t('user.registerTitle')}
      submitWrapperCol={{
        sm: { span: 24, offset: 0 },
        md: { span: 16, offset: 8 },
      }}
      wrapperCol={{
        sm: { span: 24 },
        md: { span: 16 },
      }}
    >
      {renderItems}
    </UserForm>
  )
}

export default RegistrationForm
