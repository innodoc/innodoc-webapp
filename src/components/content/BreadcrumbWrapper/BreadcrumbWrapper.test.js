import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb } from 'semantic-ui-react'

import { BreadcrumbWrapper } from './BreadcrumbWrapper'
import SectionLink from '../../SectionLink'

describe('<BreadcrumbWrapper />', () => {
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
      <BreadcrumbWrapper sections={sections} />
    )
    expect(wrapper.find(Breadcrumb)).toExist()
    expect(wrapper.find(Breadcrumb.Section)).toHaveLength(3)
    expect(wrapper.find(SectionLink)).toHaveLength(2)
    expect(wrapper.find(Breadcrumb.Divider)).toHaveLength(2)
  })
})
