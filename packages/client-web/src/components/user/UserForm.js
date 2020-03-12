import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Form } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { MESSAGE_LEVELS } from '@innodoc/client-misc/src/messageDef'
import { childrenType } from '@innodoc/client-misc/src/propTypes'

const UserForm = ({
  children,
  disabled,
  extra,
  labelCol,
  message,
  name,
  onFinish,
  submitIcon,
  submitText,
  submitWrapperCol,
  wrapperCol,
}) => {
  const messageAlert = message ? (
    <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
      <Alert
        afterClose={message.afterClose}
        closable
        description={message.description}
        message={message.message}
        showIcon
        type={message.level}
      />
    </Form.Item>
  ) : null

  return (
    <Form
      labelCol={labelCol}
      name={name}
      onFinish={onFinish}
      wrapperCol={wrapperCol}
    >
      {children}
      <Form.Item wrapperCol={submitWrapperCol}>
        <Button disabled={disabled} htmlType="submit" type="primary">
          {disabled ? <LoadingOutlined /> : submitIcon}
          {submitText}
        </Button>
        <br />
        {extra}
      </Form.Item>
      {messageAlert}
    </Form>
  )
}

UserForm.defaultProps = {
  extra: null,
  labelCol: null,
  message: null,
  submitWrapperCol: null,
  wrapperCol: null,
}

UserForm.propTypes = {
  children: childrenType.isRequired,
  disabled: PropTypes.bool.isRequired,
  extra: childrenType,
  labelCol: PropTypes.objectOf(PropTypes.any),
  message: PropTypes.shape({
    afterClose: PropTypes.func,
    description: PropTypes.string,
    message: PropTypes.string,
    level: PropTypes.oneOf(MESSAGE_LEVELS),
  }),
  name: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  submitIcon: PropTypes.node.isRequired,
  submitText: PropTypes.string.isRequired,
  submitWrapperCol: PropTypes.objectOf(PropTypes.any),
  wrapperCol: PropTypes.objectOf(PropTypes.any),
}

export default UserForm
