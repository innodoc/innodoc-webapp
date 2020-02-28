import React from 'react'
import Link from 'next/link'
import { Button, Form, Input } from 'antd'
import { UserAddOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'

import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'

const LoginLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/login">
      <a>{t('user.signIn')}</a>
    </Link>
  )
}

const RegisterForm = () => {
  const { t } = useTranslation()
  // const onFinish = (values) => {
  //   console.log('Success:', values)
  // }
  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo)
  // }

  // onFinish={onFinish}
  // onFinishFailed={onFinishFailed}
  return (
    <Form
      name="register-form"
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
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        label={t('user.password')}
        name="password"
        rules={[{ required: true, message: t('user.passwordMissing') }]}
      >
        <Input prefix={<LockOutlined />} type="password" />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          sm: { span: 24, offset: 0 },
          md: { span: 16, offset: 8 },
        }}
      >
        <Button type="primary" htmlType="submit">
          <UserAddOutlined />
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
