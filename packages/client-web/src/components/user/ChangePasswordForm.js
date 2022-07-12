import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { LockOutlined } from '@ant-design/icons'

import { api } from '@innodoc/client-misc'
import { Trans, useTranslation } from 'next-i18next'
import appSelectors from '@innodoc/client-store/src/selectors'

import { PasswordField } from './formFields'
import Link from '../Link'
import UserForm from './UserForm'

const ChangePasswordForm = () => {
  const { csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ 'old-password': oldPassword, password }, setDisabled, setMessage) =>
      api
        .changePassword(csrfToken, password, oldPassword)
        .then(() =>
          setMessage({
            afterClose: () => setMessage(),
            level: 'success',
            description: t('user.changePassword.success.description'),
            message: t('user.changePassword.success.message'),
          })
        )
        .catch(() => {
          setMessage({
            afterClose: () => setMessage(),
            level: 'error',
            description: (
              <Trans i18nKey="user.changePassword.error.description">
                Your password could not be changed.
                <br />
                <Link href="/request-password-reset">I don&apos;t remember my password</Link>
              </Trans>
            ),
            message: t('user.changePassword.error.message'),
          })
          setDisabled(false)
        }),
    [csrfToken, t]
  )

  return (
    <UserForm
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
      name="change-password-form"
      onFinish={onFinish}
      submitIcon={<LockOutlined />}
      submitText={t('user.changePassword.submit')}
      submitWrapperCol={{
        sm: { span: 24, offset: 0 },
        md: { span: 16, offset: 8 },
      }}
      wrapperCol={{
        sm: { span: 24 },
        md: { span: 16 },
      }}
    >
      {(disabled) => (
        <>
          <PasswordField
            disabled={disabled}
            hasLabel
            label={t('user.changePassword.oldPassword')}
            name="old-password"
          />
          <PasswordField
            disabled={disabled}
            hasLabel
            label={t('user.changePassword.newPassword')}
            validate
          />
          <PasswordField disabled={disabled} hasLabel isConfirm />
        </>
      )}
    </UserForm>
  )
}

export default ChangePasswordForm
