import React from 'react'
import { mount, shallow } from 'enzyme'

import { api } from '@innodoc/client-misc'
import { showMessage } from '@innodoc/client-store/src/actions/ui'

import RegistrationForm from './RegistrationForm'
import UserForm from './UserForm'

jest.mock('@innodoc/common/src/i18n')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc', () => ({
  api: {
    checkEmail: jest.fn(),
    registerUser: jest.fn(),
  },
}))

describe('<RegistrationForm />', () => {
  const setDisabled = jest.fn()
  const setMessage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<RegistrationForm />)
    const userForm = wrapper.find(UserForm)
    expect(userForm.prop('name')).toBe('registration-form')
    const fields = userForm.renderProp('children')(false)
    const emailField = fields.childAt(0)
    expect(emailField.prop('disabled')).toBe(false)
    expect(emailField.prop('hasLabel')).toBe(true)
    expect(emailField.prop('rules')).toBeInstanceOf(Array)
    const passwordField = fields.childAt(1)
    expect(passwordField.prop('disabled')).toBe(false)
    expect(passwordField.prop('hasLabel')).toBe(true)
    expect(passwordField.prop('validate')).toBe(true)
    const confirmPasswordField = fields.childAt(2)
    expect(confirmPasswordField.prop('disabled')).toBe(false)
    expect(confirmPasswordField.prop('hasLabel')).toBe(true)
    expect(confirmPasswordField.prop('isConfirm')).toBe(true)
  })

  describe('email validation', () => {
    it('should validate email if not already used', async () => {
      expect.assertions(3)
      api.checkEmail.mockResolvedValue(true)
      const rule = shallow(<RegistrationForm />)
        .find(UserForm)
        .renderProp('children')(false)
        .childAt(0)
        .prop('rules')[0]
      expect(rule.validateTrigger).toBe('onFinish')
      await expect(rule.validator(rule, 'alice@example.com')).resolves.toBe(true)
      expect(api.checkEmail).toBeCalledWith('123csrftoken', 'alice@example.com')
    })

    it('should not validate email if already used', async () => {
      expect.assertions(2)
      api.checkEmail.mockRejectedValue(new Error())
      const rule = shallow(<RegistrationForm />)
        .find(UserForm)
        .renderProp('children')(false)
        .childAt(0)
        .prop('rules')[0]
      await expect(rule.validator(rule, 'alice@example.com')).rejects.toThrow()
      expect(api.checkEmail).toBeCalledWith('123csrftoken', 'alice@example.com')
    })
  })

  it('should render with successful registration', async () => {
    expect.assertions(4)
    api.registerUser.mockResolvedValue()
    const wrapper = mount(<RegistrationForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        email: 'alice@example.com',
        password: 's3cr3t',
      },
      setDisabled,
      setMessage
    )
    expect(api.registerUser).toBeCalledWith('123csrftoken', 'alice@example.com', 's3cr3t')
    await waitForComponent(wrapper)
    expect(setMessage).not.toBeCalled()
    expect(setDisabled).not.toBeCalled()
    expect(mockDispatch).toBeCalledWith(
      showMessage({
        closable: false,
        level: 'success',
        type: 'registerUserSuccess',
      })
    )
  })

  it('should render with failed registration', async () => {
    expect.assertions(4)
    api.registerUser.mockRejectedValue(new Error('mock error'))
    const wrapper = mount(<RegistrationForm />)
    wrapper.find(UserForm).invoke('onFinish')(
      {
        email: 'alice@example.com',
        password: 's3cr3t',
      },
      setDisabled,
      setMessage
    )
    expect(api.registerUser).toBeCalledWith('123csrftoken', 'alice@example.com', 's3cr3t')
    await waitForComponent(wrapper)
    expect(setMessage.mock.calls[0][0].level).toBe('error')
    expect(setDisabled).toBeCalledWith(false)
    expect(mockDispatch).not.toBeCalled()
  })
})
