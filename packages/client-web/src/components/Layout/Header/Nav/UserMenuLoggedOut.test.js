import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'

import UserMenuLoggedOut from './UserMenuLoggedOut'

describe('<UserMenuLoggedOut />', () => {
  it('should render dropdown', () => {
    const wrapper = shallow(<UserMenuLoggedOut />)
    expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
  })
})
