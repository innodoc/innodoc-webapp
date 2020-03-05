import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Button, Form, Input } from 'antd'
import {
  MailOutlined,
  LoadingOutlined,
  LockOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { registerUser } from '@innodoc/client-store/src/actions/user'

const LoginLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/login">
      <a>{t('user.signIn')}</a>
    </Link>
  )
}

const RegisterForm = () => {
  const [disabled, setDisabled] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onFinish = ({ email, password }) => {
    dispatch(registerUser(email, password))
    setDisabled(true)
  }
  return (
    <Form
      name="register-form"
      onFinish={onFinish}
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
      wrapperCol={{
        sm: { span: 24 },
        md: { span: 16 },
      }}
    >
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

      <Form.Item
        wrapperCol={{
          sm: { span: 24, offset: 0 },
          md: { span: 16, offset: 8 },
        }}
      >
        <Button disabled={disabled} htmlType="submit" type="primary">
          {disabled ? <LoadingOutlined /> : <UserAddOutlined />}
          {t('user.registerTitle')}
        </Button>
        <br />
        <Trans i18nKey="user.orLogin">
          or <LoginLink /> if you already have an account.
        </Trans>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm
