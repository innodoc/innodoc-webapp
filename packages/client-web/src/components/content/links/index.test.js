import React from 'react'
import { shallow } from 'enzyme'

import { InternalLink, PageLink, SectionLink } from '.'

describe('<InternalLink />', () => {
  it.each([
    ['section', SectionLink],
    ['page', PageLink],
  ])('should render (%s)', (contentType, LinkComponent) => {
    const wrapper = shallow(<InternalLink href={`/${contentType}/foo/bar`} />)
    const linkComponent = wrapper.find(LinkComponent)
    expect(linkComponent).toHaveLength(1)
    expect(linkComponent.prop('contentId')).toBe('foo/bar')
  })

  it('should render with malformed href (development)', () => {
    const wrapper = shallow(<InternalLink href="/foo/bar">Foo</InternalLink>)
    expect(wrapper.exists(PageLink)).toBe(false)
    expect(wrapper.exists(SectionLink)).toBe(false)
    expect(wrapper.text()).toMatch('Unhandled internal link: /foo/bar')
  })

  it('should render with malformed href (production)', () => {
    process.env.NODE_ENV = 'production'
    const wrapper = shallow(<InternalLink href="/foo/bar">Foo</InternalLink>)
    expect(wrapper.exists(PageLink)).toBe(false)
    expect(wrapper.exists(SectionLink)).toBe(false)
    expect(wrapper.text()).toBe('Foo')
  })
})
