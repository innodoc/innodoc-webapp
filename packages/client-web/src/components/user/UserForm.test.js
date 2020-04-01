import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Button, Form, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import UserForm from './UserForm'

const Extra = () => {}
const Icon = () => {}

const renderUserForm = (props) =>
  shallow(
    <UserForm
      name="test-form"
      onFinish={() => {}}
      submitIcon={<Icon />}
      submitText="Submit"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {(disabled) => (
        <Form.Item>
          <Input disabled={disabled} />
        </Form.Item>
      )}
    </UserForm>
  )

describe('<UserForm />', () => {
  it('should render', () => {
    const wrapper = renderUserForm({
      extra: <Extra />,
      labelCol: { md: 10 },
      submitWrapperCol: { xs: 24 },
      wrapperCol: { lg: 12 },
    })
    const form = wrapper.find(Form)
    expect(form.prop('name')).toBe('test-form')
    expect(form.exists(Extra)).toBe(true)
    expect(form.prop('labelCol')).toEqual({ md: 10 })
    expect(form.prop('wrapperCol')).toEqual({ lg: 12 })
    expect(form.find(Form.Item)).toHaveLength(2)
    const submitFormItem = form.find(Form.Item).last()
    expect(submitFormItem.prop('wrapperCol')).toEqual({ xs: 24 })
    expect(submitFormItem.children(Button).children().at(1).text()).toBe(
      'Submit'
    )
    expect(wrapper.exists(Alert)).toBe(false)
  })

  it('should render message alert', () => {
    const message = {
      description: 'Test description',
      level: 'info',
      message: 'Test message',
    }
    const onFinish = jest.fn((fields, setDisabled, setMessage) => {
      setMessage(message)
      return Promise.resolve()
    })
    const wrapper = renderUserForm({ onFinish })
    expect(wrapper.exists(Alert)).toBe(false)
    wrapper.find(Form).invoke('onFinish')()
    const alert = wrapper.find(Alert)
    expect(alert.prop('description')).toBe('Test description')
    expect(alert.prop('type')).toBe('info')
    expect(alert.prop('message')).toBe('Test message')
    alert.invoke('afterClose')()
    expect(wrapper.exists(Alert)).toBe(false)
  })

  it('should render hidden', () => {
    const wrapper = renderUserForm({ hide: true })
    expect(wrapper.find(Form).prop('style').display).toBe('none')
  })

  it('should handle form states', (done) => {
    let promise
    let resolve
    const onFinish = () => {
      promise = new Promise((_resolve) => {
        resolve = _resolve
      })
      return promise
    }
    const wrapper = renderUserForm({ onFinish })
    let submitButton = wrapper.find(Button)
    let submitIcon = submitButton.childAt(0)
    expect(wrapper.find(Input).prop('disabled')).toBe(false)
    expect(submitButton.prop('disabled')).toBe(false)
    expect(submitIcon.containsMatchingElement(<LoadingOutlined />)).toBe(false)
    expect(submitIcon.containsMatchingElement(<Icon />)).toBe(true)
    wrapper.find(Form).invoke('onFinish')()
    submitButton = wrapper.find(Button)
    submitIcon = submitButton.childAt(0)
    expect(wrapper.find(Input).prop('disabled')).toBe(true)
    expect(submitButton.prop('disabled')).toBe(true)
    expect(submitIcon.containsMatchingElement(<LoadingOutlined />)).toBe(true)
    expect(submitIcon.containsMatchingElement(<Icon />)).toBe(false)
    promise.finally(() => {
      submitButton = wrapper.find(Button)
      submitIcon = submitButton.childAt(0)
      expect(submitIcon.containsMatchingElement(<LoadingOutlined />)).toBe(
        false
      )
      expect(submitIcon.containsMatchingElement(<Icon />)).toBe(true)
      done()
    })
    resolve()
  })
})
