import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'
import { FilePdfOutlined, LineChartOutlined } from '@ant-design/icons'

import pageSelectors from '@innodoc/client-store/src/selectors/page'

import NavMenu from './NavMenu'
import PageIcon from '../../PageIcon'

jest.mock('@innodoc/common/src/i18n')

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

let mockPathname
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: mockPathname }),
}))

describe('<NavMenu />', () => {
  it('should render', () => {
    mockPathname = ''

    const wrapper = shallow(<NavMenu menuMode="vertical" />)
    expect(wrapper.find(Menu).prop('mode')).toBe('vertical')
    const items = wrapper.children()
    expect(items).toHaveLength(4)

    const item1 = items.at(0)
    const Icon1 = () => item1.prop('icon')
    expect(shallow(<Icon1 />).is(PageIcon)).toBe(true)
    expect(item1.prop('icon').props.type).toBe('foo-icon')
    expect(item1.prop('itemActive')).toBe(true)
    expect(item1.prop('pageId')).toBe('foo')
    expect(item1.prop('title')).toBe('Foo')
    expect(item1.prop('titleLong')).toBe('Foo title')

    const item2 = items.at(1)
    const Icon2 = () => item2.prop('icon')
    expect(shallow(<Icon2 />).is(PageIcon)).toBe(true)
    expect(item2.prop('icon').props.type).toBe('qux-icon')
    expect(item2.prop('itemActive')).toBe(false)
    expect(item2.prop('pageId')).toBe('qux')
    expect(item2.prop('title')).toBe('Qux')
    expect(item2.prop('titleLong')).toBe('Qux title')

    const item3 = items.at(2)
    const Icon3 = () => item3.prop('icon')
    expect(shallow(<Icon3 />).is(LineChartOutlined)).toBe(true)
    expect(item3.prop('itemActive')).toBe(false)
    expect(item3.prop('href')).toBe('/progress')
    expect(item3.prop('title')).toBe('progress.title')
    expect(item3.prop('titleLong')).toBe('progress.titleLong')

    const item4 = items.at(3)
    expect(item4.is(Menu.Item)).toBe(true)
    const anchor = item4.find('a')
    expect(anchor.prop('title')).toBe('header.downloadPDFTitle')
    expect(anchor.exists(FilePdfOutlined)).toBe(true)
    expect(anchor.text()).toContain('header.downloadPDF')
  })

  it('should render progress item as active', () => {
    mockPathname = '/progress'
    const wrapper = shallow(<NavMenu menuMode="vertical" />)
    expect(wrapper.children().at(2).prop('itemActive')).toBe(true)
  })
})
