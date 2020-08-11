import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserAddOutlined } from '@ant-design/icons'

import { checkEmail, registerUser } from '@innodoc/client-misc/src/api'
import { useTranslation, Trans } from '@innodoc/client-misc/src/i18n'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import appSelectors from '@innodoc/client-store/src/selectors'

import { EmailField, PasswordField } from './formFields'
import Link from '../Link'
import UserForm from './UserForm'

const RegistrationForm = () => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFinish = useCallback(
    ({ email, password }, setDisabled, setMessage) =>
      registerUser(appRoot, csrfToken, email, password)
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
                {t('user.registration.error.description')}
                <br />
                {error.message}
              </>
            ),
            message: t('user.registration.error.message'),
          })
          setDisabled(false)
        }),
    [appRoot, csrfToken, dispatch, t]
  )

  const extra = (
    <Trans i18nKey="user.registration.orLogin">
      or <Link href="/login">sign in</Link> if you already have an account.
    </Trans>
  )

  return (
    <UserForm
      extra={extra}
      labelCol={{
        sm: { span: 24 },
        md: { span: 8 },
      }}
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
      {(disabled) => (
        <>
          <EmailField
            disabled={disabled}
            hasLabel
            rules={[
              {
                validator: (rule, value) =>
                  checkEmail(appRoot, csrfToken, value).catch(() =>
                    Promise.reject(new Error(t('user.emailValidation.alreadyUsed')))
                  ),
                validateTrigger: 'onFinish',
              },
            ]}
          />
          <PasswordField disabled={disabled} hasLabel validate />
          <PasswordField disabled={disabled} hasLabel isConfirm />
        </>
      )}
    </UserForm>
  )
}

export default RegistrationForm
