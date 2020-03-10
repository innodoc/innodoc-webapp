import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { LockOutlined } from '@ant-design/icons'

import { resetPassword } from '@innodoc/client-misc/src/api'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

import { PasswordField } from './formFields'
import Link from '../Link'
import UserForm from './UserForm'

const ResetPasswordForm = ({ token }) => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ password }, setDisabled, setMessage) =>
      resetPassword(appRoot, csrfToken, password, token)
        .then(() =>
          setMessage({
            afterClose: () => setMessage(),
            level: 'success',
            description: (
              <Trans i18nKey="user.resetPassword.success.description">
                A new password has been set. You can now{' '}
                <Link href="/login">sign in</Link>.
              </Trans>
            ),
            message: t('user.resetPassword.success.message'),
          })
        )
        .catch(() => {
          setMessage({
            afterClose: () => setMessage(),
            level: 'error',
            description: t('user.resetPassword.error.description'),
            message: t('user.resetPassword.error.message'),
          })
          setDisabled(false)
        }),
    [appRoot, csrfToken, t, token]
  )

  return (
    <UserForm
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
      name="reset-password-form"
      onFinish={onFinish}
      submitIcon={<LockOutlined />}
      submitText={t('user.resetPassword.submit')}
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
          <PasswordField disabled={disabled} hasLabel validate />
          <PasswordField disabled={disabled} hasLabel isConfirm />
        </>
      )}
    </UserForm>
  )
}

ResetPasswordForm.propTypes = {
  token: PropTypes.string.isRequired,
}

export default ResetPasswordForm
