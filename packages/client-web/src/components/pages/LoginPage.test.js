import React from 'react'
import { shallow } from 'enzyme'

import LoginPage from './LoginPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import LoginForm from '../user/LoginForm'

describe('<LoginPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<LoginPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(LoginForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.login.title')
  })
})
