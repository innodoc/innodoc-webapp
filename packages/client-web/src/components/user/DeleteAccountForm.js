import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from 'antd'
import { WarningOutlined } from '@ant-design/icons'

import { api } from '@innodoc/client-misc'
import { useTranslation } from 'next-i18next'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { userLoggedOut } from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'

import { PasswordField } from './formFields'
import UserForm from './UserForm'
import css from './user.module.sss'

const DeleteAccountForm = () => {
  const { csrfToken } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFinish = useCallback(
    ({ password }, setDisabled, setMessage) =>
      api
        .deleteAccount(csrfToken, password)
        .then(() => {
          dispatch(
            showMessage({
              closable: false,
              level: 'success',
              type: 'deleteAccountSuccess',
            })
          )
          dispatch(userLoggedOut())
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
