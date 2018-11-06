import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'semantic-ui-react'

import { Toc } from './Toc'

describe('<Toc />', () => {
  const toc = [
    {
      id: 'section-1',
      title: [{ t: 'Str', c: 'Section 1' }],
      children: [
        {
          id: 'section-1-1',
          title: [{ t: 'Str', c: 'Section 1-1' }],
        },
      ],
    },
    {
      id: 'section-2',
      title: [{ t: 'Str', c: 'Section 2' }],
    },
  ]

  it('renders', () => {
    const wrapper = shallow(
      <Toc toc={toc} />
    )
    const menu = wrapper.find(Menu)
    expect(menu).toExist()
    // const tocItems = menu.find(TocItem)
    // expect(tocItems).toHaveLength(2)
    // const firstTocItem = tocItems.at(0)
    // expect(firstTocItem.prop('title')).toEqual(toc[0].title)
    // expect(firstTocItem.prop('sectionPath')).toBe('section-1')
    // expect(firstTocItem.prop('subSections')).toEqual(toc[0].children)
    // const secondTocItem = tocItems.at(1)
    // expect(secondTocItem.prop('title')).toEqual(toc[1].title)
    // expect(secondTocItem.prop('sectionPath')).toBe('section-2')
  })

  it('renders with header', () => {
    const wrapper = shallow(
      <Toc toc={toc} header="Header title" />
    )
    const headerItem = wrapper.find(Menu.Item).first()
    expect(headerItem.prop('header')).toBe(true)
    expect(headerItem.dive().text()).toBe('Header title')
  })

  it('renders with section prefix', () => {
    // const wrapper = shallow(
    //   <Toc toc={toc} sectionPrefix="section-prefix/" />
    // )
    // const tocItems = wrapper.find(TocItem)
    // expect(tocItems.at(0).prop('sectionPath')).toBe('section-1')
    // expect(tocItems.at(0).prop('sectionPrefix')).toBe('section-prefix/')
    // expect(tocItems.at(1).prop('sectionPath')).toBe('section-2')
    // expect(tocItems.at(1).prop('sectionPrefix')).toBe('section-prefix/')
  })
})
