import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Col from 'antd/lib/col'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import fragmentSelectors from '@innodoc/client-store/src/selectors/fragment'
import pageSelectors from '@innodoc/client-store/src/selectors/page'

import Footer from './Footer'
import FooterLink from './Link'
import ContentFragment from '../../content/ContentFragment'

const mockGetApp = appSelectors.getApp
const mockGetCurrentCourse = courseSelectors.getCurrentCourse
const mockGetCurrentPage = pageSelectors.getCurrentPage
const mockGetFooterPages = pageSelectors.getFooterPages
const mockGetFooterA = fragmentSelectors.getFooterA
const mockApp = { language: 'en' }
const mockCourse = { title: { en: 'Test Course' } }
let mockFooterA
let mockFooterB
const mockPage1 = {
  icon: 'foo',
  id: 'foo',
  shortTitle: { en: 'Foo' },
  title: { en: 'Foo page' },
}
const mockPage2 = {
  icon: 'bar',
  id: 'bar',
  shortTitle: { en: 'Bar' },
  title: { en: 'Bar page' },
}
jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetApp) {
      return mockApp
    }
    if (selector === mockGetCurrentCourse) {
      return mockCourse
    }
    if (selector === mockGetCurrentPage) {
      return mockPage1
    }
    if (selector === mockGetFooterPages) {
      return [mockPage1, mockPage2]
    }
    if (selector === mockGetFooterA) {
      return mockFooterA
    }
    return mockFooterB
  },
}))
jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/toc' }),
}))

describe('<Footer />', () => {
  it('should render', () => {
    const wrapper = shallow(<Footer />)
    expect(wrapper.find(AntLayout.Footer).exists()).toBe(true)
    expect(wrapper.find('h4').text()).toBe('Test Course')
  })

  it('should render custom page links', () => {
    const wrapper = shallow(<Footer />)
    const footerLinks = wrapper.find(FooterLink)
    expect(footerLinks).toHaveLength(4)
    const footerLink1 = footerLinks.at(0)
    expect(footerLink1.prop('active')).toBe(true)
    expect(footerLink1.prop('iconType')).toBe('foo')
    expect(footerLink1.prop('renderLink')().props.contentId).toBe('foo')
    expect(footerLink1.prop('shortTitle')).toBe('Foo')
    expect(footerLink1.prop('title')).toBe('Foo page')
    const footerLink2 = footerLinks.at(1)
    expect(footerLink2.prop('active')).toBe(false)
    expect(footerLink2.prop('iconType')).toBe('bar')
    expect(footerLink2.prop('renderLink')().props.contentId).toBe('bar')
    expect(footerLink2.prop('shortTitle')).toBe('Bar')
    expect(footerLink2.prop('title')).toBe('Bar page')
  })

  it('should render other page links', () => {
    const wrapper = shallow(<Footer />)
    const footerLinks = wrapper.find(FooterLink)
    expect(footerLinks).toHaveLength(4)
    const otherLink1 = footerLinks.at(2)
    expect(otherLink1.prop('active')).toBe(true)
    expect(otherLink1.prop('iconType')).toBe('read')
    expect(otherLink1.prop('renderLink')().props.href).toBe('/toc')
    expect(otherLink1.prop('title')).toBe('common.toc')
    const otherLink2 = footerLinks.at(3)
    expect(otherLink2.prop('active')).toBe(false)
    expect(otherLink2.prop('iconType')).toBe('bars')
    expect(otherLink2.prop('renderLink')().props.href).toBe('/index-page')
    expect(otherLink2.prop('title')).toBe('common.index')
  })

  it.each(['A', 'B'])('should render custom footer %s', (footer) => {
    const content = [{ t: 'Str', c: `Footer ${footer}` }]
    if (footer === 'A') {
      mockFooterA = { content: { en: content } }
    } else {
      mockFooterB = { content: { en: content } }
    }
    const wrapper = shallow(<Footer />)
    const col = wrapper.find(Col).at(1 + (footer === 'A' ? 0 : 1))
    expect(col.find(ContentFragment).prop('content')).toBe(content)
  })
})
