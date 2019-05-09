import React from 'react'
import { shallow } from 'enzyme'
import List from 'antd/lib/list'
import SectionLink from '../../SectionLink'

import { Subsection, SubsectionList } from './SubsectionList'

const subsections = [
  {
    id: 'bar-1',
    title: { en: 'Bar section 1' },
    content: { en: [] },
    ord: [0],
  },
  {
    id: 'bar-2',
    title: { en: 'Bar section 2' },
    content: { en: [] },
    ord: [1],
  },
]

describe('<Content />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <SubsectionList subsections={subsections} t={() => {}} />
    )
    const list = wrapper.find(List)
    expect(list.prop('dataSource')).toBe(subsections)
  })
})

describe('Subsection', () => {
  it('should render', () => {
    const wrapper = shallow(<Subsection {...subsections[0]} />)
    const sectionLink = wrapper.find(SectionLink)
    expect(sectionLink.prop('sectionId')).toEqual('bar-1')
  })
})
