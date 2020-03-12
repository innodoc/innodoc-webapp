import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Form, Input } from 'antd'
import { MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons'

import { checkEmail, registerUser } from '@innodoc/client-misc/src/api'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from '@innodoc/client-misc/src/passwordDef'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import appSelectors from '@innodoc/client-store/src/selectors'

import UserForm from './UserForm'

const LoginLink = () => {
  const { t } = useTranslation()
  return (
    <Link href="/login">
      <a>{t('user.login.signIn')}</a>
    </Link>
  )
}

const PASSWORD_VALIDATION_INTERPOLATIONS = {
  min: { min: PASSWORD_MIN_LENGTH },
  max: { max: PASSWORD_MAX_LENGTH },
}

const RegistrationForm = () => {
  const { appRoot } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [message, setMessage] = useState()
  const [disabled, setDisabled] = useState(false)

  const onFinish = ({ email, password }) => {
    setDisabled(true)
    registerUser(appRoot, email, password)
      .then(() =>
        dispatch(
          showMessage({
            closable: false,
            level: 'success',
            type: 'registerUserSuccess',
          })
        )
      )
      .catch((error) => {
        setMessage({
          afterClose: () => setMessage(),
          level: 'error',
          description: (
            <>
              {t('user.registration.fail.description')}
              <br />
              {error.message}
            </>
          ),
          message: t('user.registration.fail.message'),
        })
        setDisabled(false)
      })
  }

  const extra = (
    <Trans i18nKey="user.registration.orLogin">
      or <LoginLink /> if you already have an account.
    </Trans>
  )

  const items = (
    <>
      <Form.Item
        label={t('user.email')}
        name="email"
        rules={[
          { required: true, message: t('user.emailValidation.missing') },
          { type: 'email', message: t('user.emailValidation.invalid') },
          {
            validator: (rule, value) =>
              checkEmail(appRoot, value).catch(() =>
                Promise.reject(new Error(t('user.emailValidation.alreadyUsed')))
              ),
            validateTrigger: 'onFinish',
          },
        ]}
        validateFirst
      >
        <Input disabled={disabled} prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        label={t('user.password')}
        name="password"
        rules={[
          { required: true, message: t('user.passwordValidation.missing') },
          {
            validator: (rule, value) => {
              const errorList = validatePassword(value)
              if (errorList.length) {
                const key = errorList[0]
                const int = PASSWORD_VALIDATION_INTERPOLATIONS[key]
                const tKey = `user.passwordValidation.${key}`
                return Promise.reject(new Error(t(tKey, int)))
              }
              return Promise.resolve()
            },
          },
        ]}
        validateFirst
      >
        <Input.Password disabled={disabled} prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        dependencies={['password']}
        hasFeedback
        label={t('user.registration.confirmPassword')}
        name="confirm"
        rules={[
          {
            required: true,
            message: t('user.passwordValidation.confirm'),
          },
          ({ getFieldValue }) => ({
            validator: (rule, value) =>
              !value || getFieldValue('password') === value
                ? Promise.resolve()
                : Promise.reject(
                    new Error(t('user.passwordValidation.mismatch'))
                  ),
          }),
        ]}
        validateFirst
      >
        <Input.Password disabled={disabled} prefix={<LockOutlined />} />
      </Form.Item>
    </>
  )

  return (
    <UserForm
      disabled={disabled}
      extra={extra}
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
      message={message}
      name="registration-form"
      onFinish={onFinish}
      submitIcon={<UserAddOutlined />}
      submitText={t('user.registration.title')}
      submitWrapperCol={{
        sm: { span: 24, offset: 0 },
        md: { span: 16, offset: 8 },
      }}
      wrapperCol={{
        sm: { span: 24 },
        md: { span: 16 },
      }}
    >
      {items}
    </UserForm>
  )
}

export default RegistrationForm
