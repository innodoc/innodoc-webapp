import React from 'react'
import { shallow } from 'enzyme'

import LoginPage from './LoginPage'
import Layout from '../Layout'
import LoginForm from '../user/LoginForm'

describe('<LoginPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<LoginPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(LoginForm).exists()).toBe(true)
  })
})
