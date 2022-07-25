import { LoadingOutlined } from '@ant-design/icons'
import { Alert, Button, Form } from 'antd'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import { childrenType } from '@innodoc/misc/propTypes'

function UserForm({
  children,
  extra,
  hide,
  labelCol,
  name,
  onFinish,
  submitIcon,
  submitText,
  submitType,
  submitWrapperCol,
  wrapperCol,
}) {
  const [message, setMessage] = useState()
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFormFinish = useCallback(
    (fields) => {
      setDisabled(true)
      setLoading(true)
      onFinish(fields, setDisabled, setMessage).finally(() => setLoading(false))
    },
    [onFinish]
  )

  const messageAlert = message ? (
    <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
      <Alert
        afterClose={() => setMessage()}
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
      onFinish={onFormFinish}
      style={hide ? { display: 'none' } : null}
      wrapperCol={wrapperCol}
    >
      {children(disabled)}
      <Form.Item wrapperCol={submitWrapperCol}>
        <Button disabled={disabled} htmlType="submit" type={submitType}>
          {loading ? <LoadingOutlined /> : submitIcon}
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
  hide: false,
  labelCol: null,
  submitType: 'primary',
  submitWrapperCol: null,
  wrapperCol: null,
}

UserForm.propTypes = {
  children: PropTypes.func.isRequired,
  extra: childrenType,
  hide: PropTypes.bool,
  labelCol: PropTypes.objectOf(PropTypes.any),
  name: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  submitIcon: PropTypes.node.isRequired,
  submitText: PropTypes.string.isRequired,
  submitType: PropTypes.string,
  submitWrapperCol: PropTypes.objectOf(PropTypes.any),
  wrapperCol: PropTypes.objectOf(PropTypes.any),
}

export default UserForm
