import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'

import pageSelectors from '@innodoc/client-store/src/selectors/page'

import Nav from './Nav'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import { PageLink } from '../../../content/links'
import PageIcon from '../../PageIcon'
import css from './style.sss'

const mockGetCurrentPage = pageSelectors.getCurrentPage
const mockGetNavPages = pageSelectors.getNavPages

const mockApp = { language: 'en' }
const mockNavPages = [
  {
    content: { en: 'foo content' },
    icon: 'foo-icon',
    id: 'foo',
    inFooter: false,
    inNav: true,
    ord: 0,
    shortTitle: { en: 'Foo' },
    title: { en: 'Foo title' },
  },
  {
    content: { en: 'qux content' },
    icon: 'qux-icon',
    id: 'qux',
    inFooter: false,
    inNav: true,
    ord: 1,
    shortTitle: { en: 'Qux' },
    title: { en: 'Qux title' },
  },
]
const mockCurrentPage = mockNavPages[0]

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentPage) {
      return mockCurrentPage
    }
    if (selector === mockGetNavPages) {
      return mockNavPages
    }
    return mockApp
  },
}))

describe('<Nav />', () => {
  it('should render', () => {
    const wrapper = shallow(<Nav menuMode="vertical" />)
    expect(wrapper.find(Menu).prop('mode')).toBe('vertical')
    const menuItems = wrapper.find(Menu.Item)
    expect(menuItems).toHaveLength(4)

    const menuItem1 = menuItems.at(0)
    expect(menuItem1.find(PageLink).prop('contentId')).toBe('foo')
    expect(menuItem1.find(PageIcon).prop('type')).toBe('foo-icon')
    expect(menuItem1.find('a').childAt(1).text()).toBe('Foo')
    expect(menuItem1.find('a').prop('title')).toBe('Foo title')
    expect(menuItem1.find('a').hasClass(css.active)).toBe(true)

    const menuItem2 = menuItems.at(1)
    expect(menuItem2.find(PageLink).prop('contentId')).toBe('qux')
    expect(menuItem2.find(PageIcon).prop('type')).toBe('qux-icon')
    expect(menuItem2.find('a').childAt(1).text()).toBe('Qux')
    expect(menuItem2.find('a').prop('title')).toBe('Qux title')
    expect(menuItem2.find('a').hasClass(css.active)).toBe(false)
    expect(wrapper.exists(LanguageSwitcher)).toBe(true)
    expect(wrapper.exists(UserMenu)).toBe(true)
  })
})
