import React from 'react'
import { shallow } from 'enzyme'
import AntBreadcrumb from 'antd/lib/breadcrumb'

import Breadcrumb from './Breadcrumb'
import { SectionLink } from './links'
import courseSelectors from '../../store/selectors/course'

const mockGetCurrentCourse = courseSelectors.getCurrentCourse
const mockSections = [
  {
    id: 'section1',
    title: '1 Section',
  },
  {
    id: 'section1/section11',
    title: '1.1 Subsection',
  },
  {
    id: 'section1/section11/section111',
    title: '1.1.1 Subsection',
  },
]
jest.mock('react-redux', () => ({
  useSelector: selector => (
    selector === mockGetCurrentCourse
      ? { homeLink: 'home' }
      : mockSections
  ),
}))

describe('<Breadcrumb />', () => {
  it('renders', () => {
    const wrapper = shallow(<Breadcrumb />)
    expect(wrapper.find(AntBreadcrumb)).toHaveLength(1)
    const items = wrapper.find(AntBreadcrumb.Item)
    expect(items).toHaveLength(4)
    expect(wrapper.find(SectionLink)).toHaveLength(3)
    expect(items.at(0).find(SectionLink).prop('contentId')).toBe('home')
    expect(items.at(1).find(SectionLink).prop('contentId')).toBe('section1')
    expect(items.at(2).find(SectionLink).prop('contentId')).toBe('section1/section11')
  })
})
