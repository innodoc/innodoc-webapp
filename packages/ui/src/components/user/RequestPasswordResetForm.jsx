import { LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { requestPasswordReset } from '@innodoc/misc/api'
import { getApp } from '@innodoc/store/selectors/misc'

import EmailField from './formFields/EmailField.jsx'
import UserForm from './UserForm.jsx'

function RequestPasswordResetForm() {
  const { csrfToken } = useSelector(getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email }, setDisabled, setMessage) =>
      requestPasswordReset(csrfToken, email)
        .then(() =>
          setMessage({
            afterClose: () => setMessage(),
            level: 'success',
            description: t('user.requestPasswordReset.success.description'),
            message: t('user.requestPasswordReset.success.message'),
          })
        )
        .catch(() => {
          setMessage({
            afterClose: () => setMessage(),
            level: 'error',
            description: t('user.requestPasswordReset.error.description'),
            message: t('user.requestPasswordReset.error.message'),
          })
          setDisabled(false)
        }),
    [csrfToken, t]
  )

  return (
    <UserForm
      name="request-password-reset-form"
      onFinish={onFinish}
      submitIcon={<LockOutlined />}
      submitText={t('user.request')}
    >
      {(disabled) => <EmailField disabled={disabled} hasLabel={false} />}
    </UserForm>
  )
}

export default RequestPasswordResetForm
