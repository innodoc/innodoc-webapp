import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { MailOutlined } from '@ant-design/icons'

import { requestVerification } from '@innodoc/client-misc/src/api'
import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

import { EmailField } from './formFields'
import UserForm from './UserForm'

const RequestVerificationForm = () => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email }, setDisabled, setMessage) =>
      requestVerification(appRoot, csrfToken, email)
        .then(() =>
          setMessage({
            afterClose: () => setMessage(),
            level: 'success',
            description: t('user.requestVerification.success.description'),
            message: t('user.requestVerification.success.message'),
          })
        )
        .catch(() => {
          setMessage({
            afterClose: () => setMessage(),
            level: 'error',
            description: t('user.requestVerification.error.description'),
            message: t('user.requestVerification.error.message'),
          })
          setDisabled(false)
        }),
    [appRoot, csrfToken, t]
  )

  return (
    <UserForm
      name="request-verification-form"
      onFinish={onFinish}
      submitIcon={<MailOutlined />}
      submitText={t('user.request')}
    >
      {(disabled) => <EmailField disabled={disabled} hasLabel={false} />}
    </UserForm>
  )
}

export default RequestVerificationForm
