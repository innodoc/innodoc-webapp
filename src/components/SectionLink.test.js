import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import SectionLink from './SectionLink'

describe('<SectionLink />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SectionLink sectionPath="foo/bar">
        <a>
          Hello World!
        </a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link).toExist()
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionPath: 'foo/bar' },
    })
    expect(link.prop('as')).toBe('/page/foo/bar')
    expect(wrapper.find('a')).toExist()
  })
})
