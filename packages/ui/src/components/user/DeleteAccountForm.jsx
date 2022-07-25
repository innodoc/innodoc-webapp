import { WarningOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteAccount } from '@innodoc/misc/api'
import { showMessage } from '@innodoc/store/actions/ui'
import { userLoggedOut } from '@innodoc/store/actions/user'
import { getApp } from '@innodoc/store/selectors/misc'

import PasswordField from './formFields/PasswordField.jsx'
import css from './user.module.sss'
import UserForm from './UserForm.jsx'

function DeleteAccountForm() {
  const { csrfToken } = useSelector(getApp)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFinish = useCallback(
    ({ password }, setDisabled, setMessage) =>
      deleteAccount(csrfToken, password)
        .then(() => {
          dispatch(
            showMessage({
              closable: false,
              level: 'success',
              type: 'deleteAccountSuccess',
            })
          )
          dispatch(userLoggedOut())
          return undefined
        })
        .catch(() => {
          setMessage({
            afterClose: () => setMessage(),
            level: 'error',
            description: t('user.deleteAccount.error.description'),
            message: t('user.deleteAccount.error.message'),
          })
          setDisabled(false)
        }),
    [csrfToken, dispatch, t]
  )

  return (
    <>
      <Alert
        className={css.alert}
        description={t('user.deleteAccount.warning.description')}
        message={t('user.deleteAccount.warning.message')}
        showIcon
        type="warning"
      />
      <Alert className={css.alert} message={t('user.deleteAccount.hint')} showIcon type="info" />
      <UserForm
        labelCol={{
          sm: { span: 24 },
          md: { span: 8 },
        }}
        name="delete-account-form"
        onFinish={onFinish}
        submitIcon={<WarningOutlined />}
        submitText={t('user.deleteAccount.submit')}
        submitType="danger"
        submitWrapperCol={{
          sm: { span: 24, offset: 0 },
          md: { span: 16, offset: 8 },
        }}
        wrapperCol={{
          sm: { span: 24 },
          md: { span: 16 },
        }}
      >
        {(disabled) => <PasswordField disabled={disabled} hasLabel />}
      </UserForm>
    </>
  )
}

export default DeleteAccountForm
