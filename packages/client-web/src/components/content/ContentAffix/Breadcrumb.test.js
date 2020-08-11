import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb as AntBreadcrumb } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Breadcrumb from './Breadcrumb'
import { InternalLink, SectionLink } from '../links'

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
  useSelector: (selector) =>
    selector === mockGetCurrentCourse ? { homeLink: '/section/home' } : mockSections,
}))

describe('<Breadcrumb />', () => {
  it('renders', () => {
    const wrapper = shallow(<Breadcrumb />)
    expect(wrapper.find(AntBreadcrumb)).toHaveLength(1)
    const items = wrapper.find(AntBreadcrumb.Item)
    expect(items).toHaveLength(4)
    expect(items.at(0).find(InternalLink).prop('href')).toBe('/section/home')
    expect(items.at(1).find(SectionLink).prop('contentId')).toBe('section1')
    expect(items.at(2).find(SectionLink).prop('contentId')).toBe('section1/section11')
    expect(wrapper.find(InternalLink)).toHaveLength(1)
    expect(wrapper.find(SectionLink)).toHaveLength(2)
  })
})
