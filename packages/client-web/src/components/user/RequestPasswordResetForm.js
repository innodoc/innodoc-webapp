import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { LockOutlined } from '@ant-design/icons'

import { requestPasswordReset } from '@innodoc/client-misc/src/api'
import { useTranslation } from '@innodoc/common/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

import { EmailField } from './formFields'
import UserForm from './UserForm'

const RequestPasswordResetForm = () => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email }, setDisabled, setMessage) =>
      requestPasswordReset(appRoot, csrfToken, email)
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
    [appRoot, csrfToken, t]
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
