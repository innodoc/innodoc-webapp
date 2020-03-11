import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Alert, Button, Form, Input } from 'antd'
import {
  UserOutlined,
  LoadingOutlined,
  LockOutlined,
  LoginOutlined,
} from '@ant-design/icons'

import { MESSAGE_TYPES_LOGIN } from '@innodoc/client-misc/src/messageDef'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { closeMessage } from '@innodoc/client-store/src/actions/ui'
import { loginUser } from '@innodoc/client-store/src/actions/user'

import useUserMessage from '../../../hooks/useUserMessage'

const CreateAccountLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/register">
      <a>{t('user.createAccount')}</a>
    </Link>
  )
}

const LoginForm = () => {
  const [disabled, setDisabled] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const message = useUserMessage(MESSAGE_TYPES_LOGIN)
  const onFinish = ({ email, password }) => {
    setDisabled(true)
    dispatch(loginUser(email, password))
  }

  const messageItem = message ? (
    <Form.Item>
      <Alert
        afterClose={() => {
          dispatch(closeMessage(message.id))
          setDisabled(false)
        }}
        closable
        description={t(`user.${message.type}.description`)}
        message={t(`user.${message.type}.message`)}
        showIcon
        type={message.level}
      />
    </Form.Item>
  ) : null

  return (
    <Form
      name="login-form"
      onFinish={onFinish}
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
        <Input
          disabled={disabled}
          prefix={<UserOutlined />}
          placeholder={t('user.email')}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: t('user.passwordMissing') }]}
      >
        <Input
          disabled={disabled}
          prefix={<LockOutlined />}
          type="password"
          placeholder={t('user.password')}
        />
      </Form.Item>

      <Form.Item>
        <Button disabled={disabled} htmlType="submit" type="primary">
          {disabled ? <LoadingOutlined /> : <LoginOutlined />}
          {t('user.signIn')}
        </Button>
        <br />
        <Trans i18nKey="user.orCreateAccount">
          or <CreateAccountLink />.
        </Trans>
      </Form.Item>

      {messageItem}
    </Form>
  )
}

export default LoginForm
