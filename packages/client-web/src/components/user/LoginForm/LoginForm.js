import React from 'react'
import Link from 'next/link'
import { Button, Form, Input } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'

import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'

const CreateAccountLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/register">
      <a>{t('user.createAccount')}</a>
    </Link>
  )
}

const LoginForm = () => {
  const { t } = useTranslation()
  return (
    <Form
      name="login-form"
      wrapperCol={{
        xs: { span: 20 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
      }}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: t('user.emailMissing') }]}
      >
        <Input prefix={<UserOutlined />} placeholder={t('user.email')} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: t('user.passwordMissing') }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder={t('user.password')}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          <LoginOutlined />
          {t('user.signIn')}
        </Button>
        <br />
        <Trans i18nKey="user.orCreateAccount">
          or <CreateAccountLink />.
        </Trans>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
