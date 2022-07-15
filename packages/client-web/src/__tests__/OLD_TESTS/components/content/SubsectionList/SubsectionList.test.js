import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'antd'
import { SectionLink } from '../links'

import SubsectionList, { Subsection } from './SubsectionList'

jest.mock('@innodoc/common/src/i18n')

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
    const wrapper = shallow(<SubsectionList subsections={subsections} />)
    const list = wrapper.find(List)
    expect(list.prop('dataSource')).toBe(subsections)
    const HeaderComp = () => wrapper.prop('header')
    const headerWrapper = shallow(<HeaderComp />)
    expect(headerWrapper.children().text()).toBe('content.subsections')
  })
})

describe('Subsection', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Subsection
        id={subsections[0].id}
        title={subsections[0].title}
        content={subsections[0].content}
        ord={subsections[0].ord}
      />
    )
    const sectionLink = wrapper.find(SectionLink)
    expect(sectionLink.prop('contentId')).toEqual('bar-1')
  })
})
