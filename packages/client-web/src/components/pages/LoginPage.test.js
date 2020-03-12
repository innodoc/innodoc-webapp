import React from 'react'
import { shallow } from 'enzyme'
import { Result } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'

import LoginPage from './LoginPage'
import Layout from '../Layout'
import LoginForm from '../user/LoginForm'

const mockAppSelectors = appSelectors
let mockLoggedInEmail
jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockAppSelectors.getApp) {
      return { loggedInEmail: mockLoggedInEmail }
    }
    return { homeLink: '/home' }
  },
}))

describe('<LoginPage />', () => {
  it('should render (not logged in)', () => {
    mockLoggedInEmail = undefined
    const wrapper = shallow(<LoginPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(Result).exists()).toBe(false)
    expect(layout.find(LoginForm).exists()).toBe(true)
  })

  it('should render (logged in)', () => {
    mockLoggedInEmail = 'alice@example.com'
    const wrapper = shallow(<LoginPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(LoginForm).exists()).toBe(false)
    expect(layout.find(Result).prop('status')).toBe('success')
  })
})
