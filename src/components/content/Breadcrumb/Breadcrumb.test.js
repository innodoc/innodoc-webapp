import React from 'react'
import { shallow } from 'enzyme'
import AntBreadcrumb from 'antd/lib/breadcrumb'

import { BareBreadcrumb as Breadcrumb, mapStateToProps } from './Breadcrumb'
import SectionLink from '../../SectionLink'

describe('<Breadcrumb />', () => {
  const sections = [
    {
      id: 'section1',
      title: [{ t: 'Str', c: 'Section 1' }],
    },
    {
      id: 'section1/section11',
      title: [{ t: 'Str', c: 'Subsection 1.1' }],
    },
    {
      id: 'section1/section11/section111',
      title: [{ t: 'Str', c: 'Subsection 1.1.1' }],
    },
  ]

  it('renders', () => {
    const wrapper = shallow(
      <Breadcrumb homeLink="section1" sections={sections} t={() => {}} />
    )
    expect(wrapper.find(AntBreadcrumb)).toBeTruthy()
    expect(wrapper.find(AntBreadcrumb.Item)).toHaveLength(4)
    expect(wrapper.find(SectionLink)).toHaveLength(3)
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
