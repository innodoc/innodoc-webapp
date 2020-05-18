import React from 'react'
import { mount, shallow } from 'enzyme'
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { userLoggedOut } from '@innodoc/client-store/src/actions/user'
import { logoutUser } from '@innodoc/client-misc/src/api'
import appSelectors from '@innodoc/client-store/src/selectors'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import LogoutPage from './LogoutPage'

const mockDispatch = jest.fn()
const mockAppSelectors = appSelectors
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => {
    if (selector === mockAppSelectors.getApp) {
      return {
        appRoot: 'http://app.example.com/',
        csrfToken: '123csrftoken',
      }
    }
    return { homeLink: '/home' }
  },
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  logoutUser: jest.fn(),
}))

jest.mock('../Layout', () => ({ children }) => <>{children}</>)
jest.mock('../PageTitle', () => () => null)

describe('<LogoutPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<LogoutPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe(
      'user.logout.pendingMessage'
    )
    const result = layout.find(Result)
    expect(result.prop('status')).toBe('info')
    expect(result.prop('icon')).toEqual(<LoadingOutlined />)
    expect(result.prop('title')).toBe('user.logout.pendingMessage')
  })

  it('should render with successful logout', async () => {
    expect.assertions(5)
    logoutUser.mockResolvedValue()
    const wrapper = mount(<LogoutPage />)
    expect(logoutUser).toBeCalledWith('http://app.example.com/', '123csrftoken')
    await waitForComponent(wrapper)
    expect(mockDispatch).toBeCalledWith(userLoggedOut())
    const result = wrapper.find(Result)
    expect(result.prop('status')).toBe('success')
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('title')).toBe('user.logout.successMessage')
  })

  it('should render with failed logout', async () => {
    expect.assertions(5)
    logoutUser.mockRejectedValue()
    const wrapper = mount(<LogoutPage />)
    expect(logoutUser).toBeCalledWith('http://app.example.com/', '123csrftoken')
    await waitForComponent(wrapper)
    expect(mockDispatch).not.toBeCalled()
    const result = wrapper.find(Result)
    expect(result.prop('status')).toBe('error')
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('title')).toBe('user.logout.errorMessage')
  })
})
