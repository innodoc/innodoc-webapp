import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { MailOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'

const EmailField = ({ disabled, hasLabel, rules }) => {
  const { t } = useTranslation()
  const emailLabel = t('user.email')
  return (
    <Form.Item
      label={hasLabel ? emailLabel : undefined}
      name="email"
      rules={[
        { required: true, message: t('user.emailValidation.missing') },
        { type: 'email', message: t('user.emailValidation.invalid') },
        ...rules,
      ]}
      validateFirst
    >
      <Input
        autoComplete="email"
        disabled={disabled}
        prefix={<MailOutlined />}
        placeholder={hasLabel ? undefined : emailLabel}
      />
    </Form.Item>
  )
}

EmailField.defaultProps = {
  disabled: false,
  hasLabel: true,
  rules: [],
}

EmailField.propTypes = {
  disabled: PropTypes.bool,
  hasLabel: PropTypes.bool,
  rules: PropTypes.arrayOf(PropTypes.object),
}

export default EmailField
