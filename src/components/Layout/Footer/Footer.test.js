import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Col from 'antd/lib/col'

import Footer from './Footer'
import ContentFragment from '../../content/ContentFragment'
import { PageLink } from '../../content/links'
import appSelectors from '../../../store/selectors'
import courseSelectors from '../../../store/selectors/course'
import css from './style.sass'
import fragmentSelectors from '../../../store/selectors/fragment'
import pageSelectors from '../../../store/selectors/page'

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

describe('<Footer />', () => {
  it('should render', () => {
    const wrapper = shallow(<Footer />)
    expect(wrapper.find(AntLayout.Footer).exists()).toBe(true)
    expect(wrapper.find('h4').text()).toBe('Test Course')
  })

  it('should render page links', () => {
    const wrapper = shallow(<Footer />)
    const pageLinks = wrapper.find(PageLink)
    expect(pageLinks).toHaveLength(2)
    const pageLink1 = pageLinks.at(0)
    const pageLink2 = pageLinks.at(1)
    expect(pageLink1.prop('contentId')).toBe('foo')
    expect(pageLink1.find('a').prop('className')).toMatch(css.active)
    expect(pageLink1.find('a').prop('title')).toBe('Foo page')
    expect(pageLink1.find('a > span').text()).toBe('Foo')
    expect(pageLink2.prop('contentId')).toBe('bar')
    expect(pageLink2.find('a').prop('className')).not.toMatch(css.active)
    expect(pageLink2.find('a').prop('title')).toBe('Bar page')
    expect(pageLink2.find('a > span').text()).toBe('Bar')
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
