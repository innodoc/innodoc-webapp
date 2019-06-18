import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import SectionLink from './SectionLink'

const section = {
  id: 'foo/bar',
  title: 'Foo bar',
}
let mockSection = { section }
jest.mock('react-redux', () => ({ useSelector: () => mockSection }))

describe('<SectionLink />', () => {
  it('renders', () => {
    const wrapper = shallow(<SectionLink sectionId="foo/bar" />)
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/page/foo/bar' })
    const a = wrapper.find('a')
    expect(a.text()).toEqual('Foo bar')
  })

  it('renders with custom content', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar">
        <a>
          Hello World!
        </a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/page/foo/bar' })
    const a = wrapper.find('a')
    expect(a.prop('title')).toEqual('Foo bar')
  })

  it('renders with hash', () => {
    mockSection = {
      section,
      hash: 'baz',
    }
    const wrapper = shallow(<SectionLink sectionId="foo/bar#baz" />)
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({
      pathname: '/page/foo/bar',
      hash: '#baz',
    })
  })
})
