import React from 'react'
import { shallow } from 'enzyme'
import { Button, Drawer, Grid, Layout } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import { ContentLink } from '../../content/links'
import Header from './Header'
import NavMenu from './NavMenu'
import Logo from './Logo'
import SearchInput from './SearchInput'
import SecondMenu from './SecondMenu'

jest.mock('@innodoc/common/src/i18n')

let mockCourse
jest.mock('react-redux', () => ({
  useSelector: () => mockCourse,
}))

let mockMd
Grid.useBreakpoint = jest.fn(() => ({ md: mockMd }))

describe('<Header />', () => {
  it.each([
    ['mobile', true],
    ['non-mobile', false],
  ])('should render (%s)', (_, isMobile) => {
    mockCourse = { homeLink: '/section/foo' }
    mockMd = !isMobile
    const wrapper = shallow(<Header />)
    const header = wrapper.find(Layout.Header)

    const homeLink = header.find(ContentLink)
    expect(homeLink.prop('href')).toBe('/section/foo')
    expect(homeLink.exists(Logo)).toBe(true)

    const expectedMenuMode = isMobile ? 'inline' : 'horizontal'
    expect(wrapper.find(NavMenu).prop('menuMode')).toBe(expectedMenuMode)
    expect(wrapper.find(SecondMenu).prop('menuMode')).toBe(expectedMenuMode)

    const drawerButton = header.find(Button)
    const DrawerButtonIcon = () => drawerButton.prop('icon')
    expect(shallow(<DrawerButtonIcon />).is(MenuOutlined)).toBe(true)
    expect(drawerButton.prop('size')).toBe('large')
    expect(drawerButton.prop('title')).toBe('header.menu')

    if (isMobile) {
      const drawer = wrapper.find(Drawer)

      expect(drawer.exists(SearchInput)).toBe(true)
      expect(header.exists(SearchInput)).toBe(false)

      expect(drawer.exists(NavMenu)).toBe(true)
      expect(header.exists(NavMenu)).toBe(false)

      expect(drawer.exists(SecondMenu)).toBe(true)
      expect(header.exists(SecondMenu)).toBe(false)
    } else {
      expect(wrapper.exists(Drawer)).toBe(false)
      expect(header.exists(SearchInput)).toBe(true)
      expect(header.exists(NavMenu)).toBe(true)
      expect(header.exists(SecondMenu)).toBe(true)
    }
  })

  it('should render without home link', () => {
    mockCourse = {}
    const wrapper = shallow(<Header />)
    expect(wrapper.exists(ContentLink)).toBe(false)
  })

  it('should render without search input', () => {
    const wrapper = shallow(<Header enableSearch={false} />)
    expect(wrapper.find(Layout.Header).exists(SearchInput)).toBe(false)
  })

  it('should open and close drawer menu', () => {
    mockMd = false
    const wrapper = shallow(<Header />)
    wrapper.find(Button).at(0).simulate('click')
    expect(wrapper.find(Drawer).prop('visible')).toBe(true)
    wrapper.find(Drawer).prop('onClose')()
    expect(wrapper.find(Drawer).prop('visible')).toBe(false)
  })
})
