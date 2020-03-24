import React from 'react'
import { mount, shallow } from 'enzyme'

import { requestPasswordReset } from '@innodoc/client-misc/src/api'

import RequestPasswordResetForm from './RequestPasswordResetForm'
import UserForm from './UserForm'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  requestPasswordReset: jest.fn(),
}))

describe('<RequestPasswordResetForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<RequestPasswordResetForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('request-password-reset-form')
    const emailField = userForm.renderProp('children')(false)
    expect(emailField.prop('disabled')).toBe(false)
    expect(emailField.prop('hasLabel')).toBe(false)
  })

  it('should render with successful password request', async () => {
    requestPasswordReset.mockResolvedValue()
    const wrapper = mount(<RequestPasswordResetForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      { email: 'alice@example.com' },
      setDisabled,
      setMessage
    )
    expect(requestPasswordReset).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('success')
    expect(setDisabled).not.toBeCalled()
  })

  it('should render with failed password request', async () => {
    requestPasswordReset.mockRejectedValue(new Error('mock error'))
    const wrapper = mount(<RequestPasswordResetForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      { email: 'alice@example.com' },
      setDisabled,
      setMessage
    )
    expect(requestPasswordReset).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
  })
})
