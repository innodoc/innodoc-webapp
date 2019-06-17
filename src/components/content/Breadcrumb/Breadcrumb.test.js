import React from 'react'
import { shallow } from 'enzyme'
import AntBreadcrumb from 'antd/lib/breadcrumb'

import { BareBreadcrumb as Breadcrumb, mapStateToProps } from './Breadcrumb'
import SectionLink from '../../SectionLink'

describe('<Breadcrumb />', () => {
  const sections = [
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

  it('renders', () => {
    const wrapper = shallow(
      <Breadcrumb homeLink="home" sections={sections} />
    )
    expect(wrapper.find(AntBreadcrumb)).toHaveLength(1)
    const items = wrapper.find(AntBreadcrumb.Item)
    expect(items).toHaveLength(4)
    expect(wrapper.find(SectionLink)).toHaveLength(3)
    expect(items.at(0).find(SectionLink).prop('sectionId')).toBe('home')
    expect(items.at(1).find(SectionLink).prop('sectionId')).toBe('section1')
    expect(items.at(2).find(SectionLink).prop('sectionId')).toBe('section1/section11')
  })
})

jest.mock('../../../store/selectors/course.js', () => ({
  getCurrentCourse: () => ({ homeLink: 'homeLink' }),
}))

jest.mock('../../../store/selectors/section/index.js', () => ({
  getBreadcrumbSections: () => ['a', 'b', 'c'],
}))

describe('mapStateToProps', () => {
  it('returns homeLink and sections', () => {
    const props = mapStateToProps()
    expect(props.homeLink).toBe('homeLink')
    expect(props.sections).toEqual(['a', 'b', 'c'])
  })
})
