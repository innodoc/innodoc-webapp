import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'
import { Typography } from 'antd'

import { InternalLink, PageLink, SectionLink } from '.'

jest.mock('@innodoc/common/src/i18n')

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

  it.each([
    ['___INDEX_PAGE___', '/index-page', 'index.title'],
    ['___TOC___', '/toc', 'common.toc'],
  ])('should render special links (%s)', (href, pageHref, title) => {
    const wrapper = shallow(<InternalLink href={href} />)
    const link = wrapper.find(Link)
    expect(link.prop('href')).toBe(pageHref)
    expect(link.children().text()).toBe(title)
  })

  it('should render with malformed href (development)', () => {
    const wrapper = shallow(<InternalLink href="/foo/bar">Foo</InternalLink>)
    expect(wrapper.exists(PageLink)).toBe(false)
    expect(wrapper.exists(SectionLink)).toBe(false)
    const typography = wrapper.find(Typography.Text)
    expect(typography.prop('type')).toBe('danger')
    expect(typography.children().at(1).text()).toMatch('Unhandled internal link:')
    expect(typography.children().at(2).text()).toMatch('/foo/bar')
  })

  it('should render with malformed href (production)', () => {
    process.env.NODE_ENV = 'production'
    const wrapper = shallow(<InternalLink href="/foo/bar">Foo</InternalLink>)
    expect(wrapper.exists(PageLink)).toBe(false)
    expect(wrapper.exists(SectionLink)).toBe(false)
    expect(wrapper.text()).toBe('Foo')
  })
})
