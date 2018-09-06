import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb as SemanticBreadcrumb } from 'semantic-ui-react'

import { Breadcrumb } from './Breadcrumb'
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
      <Breadcrumb sections={sections} />
    )
    expect(wrapper.find(SemanticBreadcrumb)).toExist()
    expect(wrapper.find(SemanticBreadcrumb.Section)).toHaveLength(3)
    expect(wrapper.find(SectionLink)).toHaveLength(2)
    expect(wrapper.find(SemanticBreadcrumb.Divider)).toHaveLength(2)
  })
})
