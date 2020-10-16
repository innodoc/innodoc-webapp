import React from 'react'
import { mount } from 'enzyme'
import { Modal } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import useRequireLogin from './useRequireLogin'

let mockLoggedInEmail
jest.mock('react-redux', () => ({
  useSelector: () => ({ loggedInEmail: mockLoggedInEmail }),
}))

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('antd', () => ({
  Modal: { warning: jest.fn() },
}))

jest.mock('@innodoc/common/src/i18n')

const Component = () => {
  useRequireLogin()
  return <div />
}

describe('useRequireLogin', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should show modal if not logged in', () => {
    mockLoggedInEmail = null
    mount(<Component />)
    expect(Modal.warning).toBeCalled()
    const [[modalConfig]] = Modal.warning.mock.calls
    expect(modalConfig.content).toBe('useRequireLogin.text')
    expect(modalConfig.keyboard).toBe(false)
    expect(modalConfig.okButtonProps.icon).toEqual(<LoginOutlined />)
    expect(modalConfig.okText).toBe('user.login.title')
    expect(modalConfig.title).toBe('useRequireLogin.title')
  })

  it('should not show modal if logged in', () => {
    mockLoggedInEmail = 'alice@example.com'
    mount(<Component />)
    expect(Modal.warning).not.toBeCalled()
  })

  it('should not show modal if requireLogin = false', () => {
    mockLoggedInEmail = 'alice@example.com'
    const NoRequireLoginComponent = () => {
      useRequireLogin(false)
      return <div />
    }
    mount(<NoRequireLoginComponent />)
    expect(Modal.warning).not.toBeCalled()
  })

  it('should push "/login" route if modal button is clicked', () => {
    mockLoggedInEmail = null
    mount(<Component />)
    const [[modalConfig]] = Modal.warning.mock.calls
    const mockClose = jest.fn()
    modalConfig.onOk(mockClose)
    expect(mockClose).toBeCalled()
    expect(mockPush).toBeCalledWith('/login')
  })
})
