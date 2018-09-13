import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'semantic-ui-react'

import TocItem from './Item'
import SectionLink from '../SectionLink'
import ContentFragment from '../content/ContentFragment'

describe('<TocItem />', () => {
  const title = [{ t: 'Str', c: 'Hello title' }]

  it('renders leaf section', () => {
    const wrapper = shallow(
      <TocItem title={title} sectionPath="section-1" />
    )
    expect(wrapper.find(Menu.Item)).toHaveLength(1)
    expect(wrapper.find(SectionLink).prop('sectionPath')).toEqual('section-1')
    expect(wrapper.find(ContentFragment).prop('content')).toEqual(title)
  })

  it('renders sub-toc menu', () => {
    const subSections = [
      {
        id: 'section-1-1',
        title: [{ t: 'Str', c: 'Section 1-1' }],
        children: [
          {
            id: 'section-1-1-1',
            title: [{ t: 'Str', c: 'Section 1-1-1' }],
          },
        ],
      },
      {
        id: 'section-1-2',
        title: [{ t: 'Str', c: 'Section 1-2' }],
      },
    ]
    const wrapper = shallow(
      <TocItem title={title} sectionPath="section-1" subSections={subSections} sectionPrefix="home/" />
    )
    expect(wrapper.find(Menu.Item)).toHaveLength(1)
    expect(wrapper.find(SectionLink).prop('sectionPath')).toEqual('home/section-1')
    expect(wrapper.find(ContentFragment).prop('content')).toEqual(title)
    expect(wrapper.find(Menu.Menu)).toHaveLength(1)
    const firstItem = wrapper.find(TocItem).at(0)
    const secondItem = wrapper.find(TocItem).at(1)
    expect(firstItem.prop('title')).toEqual(subSections[0].title)
    expect(firstItem.prop('sectionPath')).toEqual('home/section-1/section-1-1')
    expect(firstItem.prop('subSections')).toEqual(subSections[0].children)
    expect(secondItem.prop('title')).toEqual(subSections[1].title)
    expect(secondItem.prop('sectionPath')).toEqual('home/section-1/section-1-2')
    expect(secondItem.prop('subSections')).toEqual([])
  })
})
