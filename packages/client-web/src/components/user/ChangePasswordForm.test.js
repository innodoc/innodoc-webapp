import React from 'react'
import { mount, shallow } from 'enzyme'

import { changePassword } from '@innodoc/client-misc/src/api'

import ChangePasswordForm from './ChangePasswordForm'
import UserForm from './UserForm'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
    loggedInEmail: 'alice@example.com',
  }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  changePassword: jest.fn(),
}))

describe('<ChangePasswordForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<ChangePasswordForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('change-password-form')
    const fields = userForm.renderProp('children')(false)
    const oldPasswordField = fields.childAt(0)
    expect(oldPasswordField.prop('disabled')).toBe(false)
    expect(oldPasswordField.prop('hasLabel')).toBe(true)
    expect(oldPasswordField.prop('name')).toBe('old-password')
    const passwordField = fields.childAt(1)
    expect(passwordField.prop('disabled')).toBe(false)
    expect(passwordField.prop('hasLabel')).toBe(true)
    expect(passwordField.prop('validate')).toBe(true)
    const confirmPasswordField = fields.childAt(2)
    expect(confirmPasswordField.prop('disabled')).toBe(false)
    expect(confirmPasswordField.prop('hasLabel')).toBe(true)
    expect(confirmPasswordField.prop('isConfirm')).toBe(true)
  })

  it('should render with successful password change', async () => {
    expect.assertions(3)
    changePassword.mockResolvedValue()
    const wrapper = mount(<ChangePasswordForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        'old-password': 'old_s3cr3t',
        password: 's3cr3t',
      },
      setDisabled,
      setMessage
    )
    expect(changePassword).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      's3cr3t',
      'old_s3cr3t'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('success')
    expect(setDisabled).not.toBeCalled()
  })

  it('should render with failed password change', async () => {
    expect.assertions(3)
    changePassword.mockRejectedValue()
    const wrapper = mount(<ChangePasswordForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        'old-password': 'wrong_s3cr3t',
        password: 's3cr3t',
      },
      setDisabled,
      setMessage
    )
    expect(changePassword).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      's3cr3t',
      'wrong_s3cr3t'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
  })
})
