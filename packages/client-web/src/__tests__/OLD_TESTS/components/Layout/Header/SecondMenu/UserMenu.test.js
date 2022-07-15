import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'

import LinkMenuItem from '../LinkMenuItem'
import UserMenu from './UserMenu'

jest.mock('@innodoc/common/src/i18n')

let mockLoggedInEmail
jest.mock('react-redux', () => ({
  useSelector: () => ({ loggedInEmail: mockLoggedInEmail }),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/delete-account' }),
}))

describe('<UserMenu />', () => {
  describe('logged in', () => {
    beforeAll(() => {
      mockLoggedInEmail = 'alice@example.com'
    })

    it('should render', () => {
      const wrapper = shallow(<UserMenu />)
      const subMenu = wrapper.find(Menu.SubMenu)

      const Title = () => subMenu.prop('title')
      const titleWrapper = shallow(<Title />)
      expect(titleWrapper.prop('title')).toBe('alice@example.com')
      expect(titleWrapper.exists(UserOutlined)).toBe(true)
      expect(titleWrapper.text()).toContain('alice@example.com')

      const items = subMenu.find(LinkMenuItem)
      expect(items).toHaveLength(3)

      const item1 = items.at(0)
      expect(item1.prop('href')).toBe('/change-password')
      const Icon1 = () => item1.prop('icon')
      expect(shallow(<Icon1 />).is(LockOutlined)).toBe(true)
      expect(item1.prop('itemActive')).toBe(false)
      expect(item1.prop('title')).toBe('user.changePassword.title')

      const item2 = items.at(1)
      expect(item2.prop('href')).toBe('/delete-account')
      const Icon2 = () => item2.prop('icon')
      expect(shallow(<Icon2 />).is(UserDeleteOutlined)).toBe(true)
      expect(item2.prop('itemActive')).toBe(true)
      expect(item2.prop('title')).toBe('user.deleteAccount.title')

      const item3 = items.at(2)
      expect(item3.prop('href')).toBe('/logout')
      const Icon3 = () => item3.prop('icon')
      expect(shallow(<Icon3 />).is(LogoutOutlined)).toBe(true)
      expect(item3.prop('itemActive')).toBe(false)
      expect(item3.prop('title')).toBe('user.logout.title')
    })
  })

  describe('logged out', () => {
    beforeAll(() => {
      mockLoggedInEmail = undefined
    })

    it('should render', () => {
      const wrapper = shallow(<UserMenu />)
      const subMenu = wrapper.find(Menu.SubMenu)

      const Title = () => subMenu.prop('title')
      const titleWrapper = shallow(<Title />)
      expect(titleWrapper.prop('title')).toBe('common.account')
      expect(titleWrapper.exists(UserOutlined)).toBe(true)
      expect(titleWrapper.text()).toContain('common.account')

      const items = subMenu.find(LinkMenuItem)
      expect(items).toHaveLength(2)

      const item1 = items.at(0)
      expect(item1.prop('href')).toBe('/login')
      const Icon1 = () => item1.prop('icon')
      expect(shallow(<Icon1 />).is(LoginOutlined)).toBe(true)
      expect(item1.prop('itemActive')).toBe(false)
      expect(item1.prop('title')).toBe('user.login.title')

      const item2 = items.at(1)
      expect(item2.prop('href')).toBe('/register')
      const Icon2 = () => item2.prop('icon')
      expect(shallow(<Icon2 />).is(UserAddOutlined)).toBe(true)
      expect(item2.prop('itemActive')).toBe(false)
      expect(item2.prop('title')).toBe('user.registration.title')
    })
  })
})
