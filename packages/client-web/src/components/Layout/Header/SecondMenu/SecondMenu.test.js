import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import SecondMenu from './SecondMenu'

jest.mock('./LanguageSwitcher', () => () => null)
jest.mock('./UserMenu', () => () => null)

describe('<SecondMenu />', () => {
  it('should render', () => {
    const wrapper = shallow(<SecondMenu menuMode="horizontal" />)
    const menu = wrapper.find(Menu)
    expect(menu.prop('mode')).toBe('horizontal')
    expect(menu.exists(LanguageSwitcher)).toBe(true)
    expect(menu.exists(UserMenu)).toBe(true)
  })
})
