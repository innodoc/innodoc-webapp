import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { LockOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from '@innodoc/client-misc/src/passwordDef'

const PasswordField = ({
  disabled,
  hasLabel,
  isConfirm,
  label,
  name,
  validate,
}) => {
  const { t } = useTranslation()
  const passwordLabel =
    label || t(`user.${isConfirm ? 'confirmPassword' : 'password'}`)

  const rules = [
    {
      required: true,
      message: t(
        `user.passwordValidation.${isConfirm ? 'confirm' : 'missing'}`
      ),
    },
  ]

  if (isConfirm) {
    rules.push(({ getFieldValue }) => ({
      validator: (rule, value) =>
        !value || getFieldValue('password') === value
          ? Promise.resolve()
          : Promise.reject(new Error(t('user.passwordValidation.mismatch'))),
    }))
  } else if (validate) {
    rules.push({
      validator: (rule, value) => {
        const errorList = validatePassword(value)
        if (errorList.length) {
          const key = errorList[0]
          const interpolations = {}
          if (key === 'min') {
            interpolations.min = PASSWORD_MIN_LENGTH
          } else if (key === 'max') {
            interpolations.max = PASSWORD_MAX_LENGTH
          }
          const tKey = `user.passwordValidation.${key}`
          return Promise.reject(new Error(t(tKey, interpolations)))
        }
        return Promise.resolve()
      },
    })
  }

  return (
    <Form.Item
      dependencies={isConfirm ? ['password'] : undefined}
      label={hasLabel ? passwordLabel : undefined}
      name={name || (isConfirm ? 'confirm-password' : 'password')}
      rules={rules}
      validateFirst
    >
      <Input.Password
        autoComplete="off"
        disabled={disabled}
        placeholder={hasLabel ? undefined : passwordLabel}
        prefix={<LockOutlined />}
      />
    </Form.Item>
  )
}

PasswordField.defaultProps = {
  disabled: false,
  hasLabel: true,
  isConfirm: false,
  label: null,
  name: null,
  validate: false,
}

PasswordField.propTypes = {
  disabled: PropTypes.bool,
  hasLabel: PropTypes.bool,
  isConfirm: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  validate: PropTypes.bool,
}

export default PasswordField
