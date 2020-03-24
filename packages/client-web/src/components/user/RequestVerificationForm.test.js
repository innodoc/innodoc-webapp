import React from 'react'
import { mount, shallow } from 'enzyme'

import { requestVerification } from '@innodoc/client-misc/src/api'

import RequestVerificationForm from './RequestVerificationForm'
import UserForm from './UserForm'
import { EmailField } from './formFields'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  requestVerification: jest.fn(),
}))

describe('<RequestVerificationForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<RequestVerificationForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('request-verification-form')
    const fields = userForm.renderProp('children')(false)
    const emailField = fields.find(EmailField)
    expect(emailField.prop('disabled')).toBe(false)
    expect(emailField.prop('hasLabel')).toBe(false)
  })

  it('should render with successful verification request', async () => {
    expect.assertions(3)
    requestVerification.mockResolvedValue()
    const wrapper = mount(<RequestVerificationForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      { email: 'alice@example.com' },
      setDisabled,
      setMessage
    )
    expect(requestVerification).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('success')
    expect(setDisabled).not.toBeCalled()
  })

  it('should render with failed verification request', async () => {
    expect.assertions(3)
    requestVerification.mockRejectedValue()
    const wrapper = mount(<RequestVerificationForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      { email: 'alice@example.com' },
      setDisabled,
      setMessage
    )
    expect(requestVerification).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com'
    )
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
  })
})
