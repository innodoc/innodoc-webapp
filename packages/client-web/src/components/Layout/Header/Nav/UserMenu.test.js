import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'

import UserMenu from './UserMenu'

describe('<UserMenu />', () => {
  it('should render (logged in)', () => {
    const wrapper = shallow(<UserMenu email="alice@example.com" />)
    expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
    const Title = () => wrapper.prop('title')
    const titleWrapper = shallow(<Title />)
    expect(titleWrapper.text()).toContain('alice@example.com')
    expect(titleWrapper.exists('a')).toBe(false)
  })

  it('should render (logged out)', () => {
    const wrapper = shallow(<UserMenu />)
    expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
    const Title = () => wrapper.prop('title')
    const titleWrapper = shallow(<Title />)
    expect(titleWrapper.exists('a')).toBe(true)
  })
})
