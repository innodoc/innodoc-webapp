import React, { useState } from 'react'
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
  const [message, setMessage] = useState()
  const [disabled, setDisabled] = useState(false)

  const onFinish = ({ email }) => {
    setDisabled(true)
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
      })
  }

  return (
    <UserForm
      disabled={disabled}
      message={message}
      name="request-verification-form"
      onFinish={onFinish}
      submitIcon={<MailOutlined />}
      submitText={t('user.request')}
    >
      <EmailField disabled={disabled} hasLabel={false} />
    </UserForm>
  )
}

export default RequestVerificationForm
