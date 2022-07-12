import React from 'react'
import { mount, shallow } from 'enzyme'

import { api } from '@innodoc/client-misc'

import ResetPasswordForm from './ResetPasswordForm'
import UserForm from './UserForm'

jest.mock('@innodoc/common/src/i18n')

jest.mock('react-redux', () => ({
  useSelector: () => ({ csrfToken: '123csrftoken' }),
}))

jest.mock('@innodoc/client-misc', () => ({
  api: { resetPassword: jest.fn() },
}))

describe('<ResetPasswordForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<ResetPasswordForm token="123token" />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('reset-password-form')
    const fields = userForm.renderProp('children')(false)
    const passwordField = fields.childAt(0)
    expect(passwordField.prop('disabled')).toBe(false)
    expect(passwordField.prop('hasLabel')).toBe(true)
    expect(passwordField.prop('validate')).toBe(true)
    const confirmPasswordField = fields.childAt(1)
    expect(confirmPasswordField.prop('disabled')).toBe(false)
    expect(confirmPasswordField.prop('hasLabel')).toBe(true)
    expect(confirmPasswordField.prop('isConfirm')).toBe(true)
  })

  it('should render with successful password reset', async () => {
    expect.assertions(3)
    api.resetPassword.mockResolvedValue()
    const wrapper = mount(<ResetPasswordForm token="123token" />)
    wrapper.find(UserForm).invoke('onFinish')({ password: 's3cr3t' }, setDisabled, setMessage)
    expect(api.resetPassword).toBeCalledWith('123csrftoken', 's3cr3t', '123token')
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('success')
    expect(setDisabled).not.toBeCalled()
  })

  it('should render with failed password reset', async () => {
    expect.assertions(3)
    api.resetPassword.mockRejectedValue()
    const wrapper = mount(<ResetPasswordForm token="123token" />)
    wrapper.find(UserForm).invoke('onFinish')({ password: 's3cr3t' }, setDisabled, setMessage)
    expect(api.resetPassword).toBeCalledWith('123csrftoken', 's3cr3t', '123token')
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
  })
})
