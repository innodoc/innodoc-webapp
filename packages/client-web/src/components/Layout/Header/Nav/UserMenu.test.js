import React from 'react'
import { shallow } from 'enzyme'
import Menu from 'antd/es/menu'

import UserMenu from './UserMenu'

describe('<UserMenu />', () => {
  it('should render dropdown', () => {
    const wrapper = shallow(<UserMenu />)
    expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
  })
})
