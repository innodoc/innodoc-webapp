import React from 'react'
import { mount, shallow } from 'enzyme'

import { loginUser } from '@innodoc/client-misc/src/api'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import LoginForm from './LoginForm'
import UserForm from './UserForm'
import { EmailField, PasswordField } from './formFields'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  loginUser: jest.fn(),
}))

describe('<LoginForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<LoginForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('login-form')
    const fields = userForm.renderProp('children')(false)
    const emailField = fields.find(EmailField)
    expect(emailField.prop('disabled')).toBe(false)
    expect(emailField.prop('hasLabel')).toBe(false)
    const passwordField = fields.find(PasswordField)
    expect(passwordField.prop('disabled')).toBe(false)
    expect(passwordField.prop('hasLabel')).toBe(false)
  })

  it('should render with successful login', async () => {
    expect.assertions(4)
    loginUser.mockResolvedValue()
    const wrapper = mount(<LoginForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        email: 'alice@example.com',
        password: 's3cr3t',
      },
      setDisabled,
      setMessage
    )
    expect(loginUser).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com',
      's3cr3t'
    )
    await waitForComponent(wrapper)
    expect(mockDispatch).toBeCalledWith(userLoggedIn('alice@example.com'))
    expect(setMessage).not.toBeCalled()
    expect(setDisabled).not.toBeCalled()
  })

  it('should render with failed login', async () => {
    expect.assertions(4)
    loginUser.mockRejectedValue()
    const wrapper = mount(<LoginForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        email: 'alice@example.com',
        password: 'wrongPwd',
      },
      setDisabled,
      setMessage
    )
    expect(loginUser).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      'alice@example.com',
      'wrongPwd'
    )
    await waitForComponent(wrapper)
    expect(mockDispatch).not.toBeCalled()
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
  })
})
