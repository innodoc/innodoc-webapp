import React from 'react'
import { shallow } from 'enzyme'
import Menu from 'antd/lib/menu'

import Nav from './Nav'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'

describe('<Nav />', () => {
  it('should render', () => {
    const wrapper = shallow(<Nav menuMode="vertical" />)
    expect(wrapper.find(Menu).prop('mode')).toBe('vertical')
    expect(wrapper.find(LanguageSwitcher).exists()).toBe(true)
    expect(wrapper.find(UserMenu).exists()).toBe(true)
  })
})
