import { LockOutlined } from '@ant-design/icons'
import { Trans, useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { resetPassword } from '@innodoc/misc/api'
import { getApp } from '@innodoc/store/selectors/misc'

import Link from '../common/Link.jsx'

import PasswordField from './formFields/PasswordField.jsx'
import UserForm from './UserForm.jsx'

function ResetPasswordForm({ token }) {
  const { csrfToken } = useSelector(getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ password }, setDisabled, setMessage) =>
      resetPassword(csrfToken, password, token)
        .then(() =>
          setMessage({
            afterClose: () => setMessage(),
            level: 'success',
            description: (
              <Trans i18nKey="user.resetPassword.success.description">
                A new password has been set. You can now <Link href="/login">sign in</Link>.
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
    [csrfToken, t, token]
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
