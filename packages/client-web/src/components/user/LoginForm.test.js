import React from 'react'
import { mount, shallow } from 'enzyme'
import { Result } from 'antd'

import { loginUser } from '@innodoc/client-misc/src/api'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'

import LoginForm from './LoginForm'
import UserForm from './UserForm'
import { EmailField, PasswordField } from './formFields'

jest.mock('@innodoc/common/src/i18n')

const mockDispatch = jest.fn()
const mockAppSelectors = appSelectors
let mockLoggedInEmail
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => {
    if (selector === mockAppSelectors.getApp) {
      return {
        appRoot: 'http://app.example.com/',
        csrfToken: '123csrftoken',
        loggedInEmail: mockLoggedInEmail,
      }
    }
    return { homeLink: '/home' }
  },
}))

let mockQuery
jest.mock('next/router', () => ({
  useRouter: () => ({ query: mockQuery }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  loginUser: jest.fn(),
}))

describe('<LoginForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockQuery = {}
  })

  it('should render', () => {
    const wrapper = shallow(<LoginForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('login-form')
    expect(userForm.prop('hide')).toBe(false)
    const fields = userForm.renderProp('children')(false)
    const emailField = fields.find(EmailField)
    expect(emailField.prop('disabled')).toBe(false)
    expect(emailField.prop('hasLabel')).toBe(false)
    const passwordField = fields.find(PasswordField)
    expect(passwordField.prop('disabled')).toBe(false)
    expect(passwordField.prop('hasLabel')).toBe(false)
  })

  it('should render with successful login', async () => {
    expect.assertions(6)
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
    mockLoggedInEmail = 'alice@example.com'
    await waitForComponent(wrapper)
    wrapper.setProps({}) // force re-render
    expect(mockDispatch).toBeCalledWith(userLoggedIn('alice@example.com'))
    expect(setMessage).not.toBeCalled()
    expect(setDisabled).not.toBeCalled()
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('hide')).toBe(true)
    expect(wrapper.find(Result).prop('status')).toBe('success')
  })

  it('should render with failed login', async () => {
    expect.assertions(6)
    mockLoggedInEmail = undefined
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
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('hide')).toBe(false)
    expect(wrapper.exists(Result)).toBe(false)
  })

  it('should redirect with redirect_to after login', async () => {
    const replaceOld = window.location.reload
    window.location.replace = jest.fn()
    mockQuery = { redirect_to: 'https://somewhere.com/' }
    expect.assertions(1)
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
    await waitForComponent(wrapper)
    expect(window.location.replace).toBeCalledWith('https://somewhere.com/')
    window.location.reload = replaceOld
  })
})
