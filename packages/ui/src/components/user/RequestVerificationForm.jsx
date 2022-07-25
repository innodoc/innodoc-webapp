import { MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { requestVerification } from '@innodoc/misc/api'
import { getApp } from '@innodoc/store/selectors/misc'

import EmailField from './formFields/EmailField.jsx'
import UserForm from './UserForm.jsx'

function RequestVerificationForm() {
  const { csrfToken } = useSelector(getApp)
  const { t } = useTranslation()

  const onFinish = useCallback(
    ({ email }, setDisabled, setMessage) =>
      requestVerification(csrfToken, email)
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
    [csrfToken, t]
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
