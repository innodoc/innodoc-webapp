import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import SectionLink from './SectionLink'

describe('<SectionLink />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar">
        <a>
          Hello World!
        </a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link).toExist()
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/page/foo/bar' })
    expect(wrapper.find('a')).toExist()
  })

  it('renders with hash', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar#baz">
        <a>Foo</a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link).toExist()
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
