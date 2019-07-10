import React from 'react'
import { shallow } from 'enzyme'
import Menu from 'antd/lib/menu'

import Nav from './Nav'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import pageSelectors from '../../../../store/selectors/page'

const mockGetCurrentpage = pageSelectors.getCurrentPage
const mockGetNavPages = pageSelectors.getNavPages

const mockApp = { language: 'en' }
const mockNavPages = [
  {
    content: { en: 'foo content' },
    id: 'foo',
    inFooter: false,
    inNav: true,
    ord: 0,
    title: { en: 'Foo title' },
  },
  {
    content: { en: 'qux content' },
    id: 'qux',
    inFooter: false,
    inNav: true,
    ord: 1,
    title: { en: 'Qux title' },
  },
]
const mockCurrentpage = mockNavPages[0]

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentpage) {
      return mockCurrentpage
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
    expect(wrapper.find(Menu.Item)).toHaveLength(3)
    expect(wrapper.exists(LanguageSwitcher)).toBe(true)
    expect(wrapper.exists(UserMenu)).toBe(true)
  })
})
