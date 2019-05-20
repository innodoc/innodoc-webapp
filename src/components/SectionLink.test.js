import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import { makeMapStateToProps, SectionLinkBare as SectionLink } from './SectionLink'

describe('<SectionLink />', () => {
  const section = {
    id: 'foo/bar',
    title: 'Foo bar',
  }

  it('renders', () => {
    const wrapper = shallow(<SectionLink section={section} />)
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
      <SectionLink section={section}>
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
    const wrapper = shallow(<SectionLink section={section} hash="baz" />)
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

describe('makeMapStateToProps', () => {
  it('returns function', () => {
    expect(makeMapStateToProps()).toBeInstanceOf(Function)
  })
})
