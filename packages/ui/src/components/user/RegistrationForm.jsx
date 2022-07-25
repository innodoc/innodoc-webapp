import { UserAddOutlined } from '@ant-design/icons'
import { Trans, useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { checkEmail, registerUser } from '@innodoc/misc/api'
import { showMessage } from '@innodoc/store/actions/ui'
import { getApp } from '@innodoc/store/selectors/misc'

import Link from '../common/Link.jsx'

import EmailField from './formFields/EmailField.jsx'
import PasswordField from './formFields/PasswordField.jsx'
import UserForm from './UserForm.jsx'

function RegistrationForm() {
  const { csrfToken } = useSelector(getApp)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFinish = useCallback(
    ({ email, password }, setDisabled, setMessage) =>
      registerUser(csrfToken, email, password)
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
    [csrfToken, dispatch, t]
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
                validator: (_rule, value) =>
                  checkEmail(csrfToken, value).catch(() => {
                    throw new Error(t('user.emailValidation.alreadyUsed'))
                  }),
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
