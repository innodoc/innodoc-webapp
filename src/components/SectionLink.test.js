import React from 'react'
import { mount } from 'enzyme'
import Link from 'next/link'

import SectionLink from './SectionLink'

describe('<SectionLink />', () => {
  it('renders', () => {
    const wrapper = mount(
      <SectionLink sectionPath="foo/bar">
        <a>
          Hello World!
        </a>
      </SectionLink>
    )
    expect(wrapper.find(Link).exists()).toBe(true)
    const a = wrapper.find('a')
    expect(a.exists()).toBe(true)
    expect(a.text()).toBe('Hello World!')
    expect(a.prop('href')).toBe('/page/foo/bar')
  })
})
