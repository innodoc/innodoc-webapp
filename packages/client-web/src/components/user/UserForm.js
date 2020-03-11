import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Form } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/client-misc/src/i18n'
import {
  closeMessage,
  closeMessages,
} from '@innodoc/client-store/src/actions/ui'
import { FORM_STATES } from '@innodoc/client-store/src/models/App'
import appSelectors from '@innodoc/client-store/src/selectors'

import useUserMessage from '../../hooks/useUserMessage'

const UserForm = ({
  children,
  extra,
  formStateField,
  labelCol,
  messageTypes,
  name,
  onFinish,
  submitIcon,
  submitText,
  submitWrapperCol,
  wrapperCol,
}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const message = useUserMessage(messageTypes)
  const app = useSelector(appSelectors.getApp)
  const disabled = app[formStateField] === FORM_STATES.PENDING

  const messageAlert = message ? (
    <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
      <Alert
        afterClose={() => dispatch(closeMessage(message.id))}
        closable
        description={t(`user.${message.type}.description`)}
        message={t(`user.${message.type}.message`)}
        showIcon
        type={message.level}
      />
    </Form.Item>
  ) : null

  const onFormFinish = (fields) => {
    dispatch(closeMessages(messageTypes))
    onFinish(fields)
  }

  return (
    <Form
      form={form}
      labelCol={labelCol}
      name={name}
      onFinish={onFormFinish}
      wrapperCol={wrapperCol}
    >
      {children(disabled)}
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
  submitWrapperCol: null,
  wrapperCol: null,
}

UserForm.propTypes = {
  children: PropTypes.func.isRequired,
  extra: childrenType,
  formStateField: PropTypes.string.isRequired,
  labelCol: PropTypes.objectOf(PropTypes.any),
  messageTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  submitIcon: PropTypes.node.isRequired,
  submitText: PropTypes.string.isRequired,
  submitWrapperCol: PropTypes.objectOf(PropTypes.any),
  wrapperCol: PropTypes.objectOf(PropTypes.any),
}

export default UserForm
