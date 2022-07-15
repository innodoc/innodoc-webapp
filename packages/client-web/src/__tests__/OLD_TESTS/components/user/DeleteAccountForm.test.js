import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from 'antd'

import api from '@innodoc/client-misc'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { userLoggedOut } from '@innodoc/client-store/src/actions/user'

import DeleteAccountForm from './DeleteAccountForm'
import { PasswordField } from './formFields'
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
  api: { deleteAccount: jest.fn() },
}))

describe('<DeleteAccountForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<DeleteAccountForm />)
    const alerts = wrapper.find(Alert)
    expect(alerts).toHaveLength(2)
    const warning = alerts.at(0)
    expect(warning.prop('type')).toBe('warning')
    expect(warning.prop('description')).toBe('user.deleteAccount.warning.description')
    expect(warning.prop('message')).toBe('user.deleteAccount.warning.message')
    const info = alerts.at(1)
    expect(info.prop('type')).toBe('info')
    expect(info.prop('message')).toBe('user.deleteAccount.hint')
    const form = wrapper.find(UserForm)
    expect(form.prop('submitText')).toBe('user.deleteAccount.submit')
    expect(form.prop('submitType')).toBe('danger')
    expect(form.dive().find(PasswordField)).toHaveLength(1)
  })

  describe('onFinish', () => {
    const prepare = () => {
      const setDisabled = jest.fn()
      const setMessage = jest.fn()
      const wrapper = shallow(<DeleteAccountForm />)
      const onFinishPromise = wrapper.find(UserForm).invoke('onFinish')(
        { password: 'abc123ABC!' },
        setDisabled,
        setMessage
      )
      return { setDisabled, setMessage, onFinishPromise }
    }

    it('should call deleteAccount with success', async () => {
      expect.assertions(8)
      api.deleteAccount.mockResolvedValueOnce()
      const { setDisabled, setMessage, onFinishPromise } = prepare()
      await expect(onFinishPromise).resolves.toBeUndefined()
      expect(api.deleteAccount).toBeCalledTimes(1)
      expect(api.deleteAccount).toBeCalledWith('123csrftoken', 'abc123ABC!')
      expect(mockDispatch).toBeCalledTimes(2)
      expect(mockDispatch).toBeCalledWith(
        showMessage({
          closable: false,
          level: 'success',
          type: 'deleteAccountSuccess',
        })
      )
      expect(mockDispatch).toBeCalledWith(userLoggedOut())
      expect(setDisabled).not.toBeCalled()
      expect(setMessage).not.toBeCalled()
    })

    it('should call deleteAccount with error', async () => {
      expect.assertions(9)
      api.deleteAccount.mockRejectedValueOnce()
      const { setDisabled, setMessage, onFinishPromise } = prepare()
      await expect(onFinishPromise).resolves.toBeUndefined()
      expect(api.deleteAccount).toBeCalledTimes(1)
      expect(api.deleteAccount).toBeCalledWith('123csrftoken', 'abc123ABC!')
      expect(mockDispatch).not.toBeCalled()
      expect(setMessage).toBeCalledTimes(1)
      expect(setMessage).toBeCalledWith({
        afterClose: expect.any(Function),
        level: 'error',
        description: 'user.deleteAccount.error.description',
        message: 'user.deleteAccount.error.message',
      })
      expect(setDisabled).toBeCalledWith(false)
      setMessage.mock.calls[0][0].afterClose()
      expect(setMessage).toBeCalledTimes(2)
      expect(setMessage).toBeCalledWith()
    })
  })
})
