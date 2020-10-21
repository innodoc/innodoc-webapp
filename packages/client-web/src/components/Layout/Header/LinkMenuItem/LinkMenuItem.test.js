import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'
import { Menu } from 'antd'

import { PageLink } from '../../../content/links'
import LinkMenuItem from './LinkMenuItem'
import css from './style.sss'

jest.mock('../../../content/links', () => ({
  PageLink: () => {},
}))

const IconComponent = () => {}

describe('<LinkMenuItem />', () => {
  it.each([true, false])('should render (active=%s)', (isActive) => {
    const wrapper = shallow(
      <LinkMenuItem
        icon={<IconComponent />}
        itemActive={isActive}
        href="/foo"
        title="Foo title"
        titleLong="Foo long title"
      />
    )
    const menuItem = wrapper.find(Menu.Item)
    const anchor = menuItem.find('a')
    expect(anchor.hasClass(css.active)).toBe(isActive)
    expect(anchor.prop('title')).toBe('Foo long title')
    expect(anchor.exists(IconComponent)).toBe(true)
    expect(anchor.text()).toContain('Foo title')
  })

  it('should render <Link /> with href given', () => {
    const wrapper = shallow(<LinkMenuItem icon={<IconComponent />} href="/foo" title="" />)
    expect(wrapper.exists(PageLink)).toBe(false)
    expect(wrapper.find(Link).prop('href')).toBe('/foo')
  })

  it('should render <PageLink /> with pageId given', () => {
    const wrapper = shallow(<LinkMenuItem icon={<IconComponent />} pageId="bar" title="" />)
    expect(wrapper.exists(Link)).toBe(false)
    expect(wrapper.find(PageLink).prop('contentId')).toBe('bar')
  })

  it('should throw if neither href or pageId given', () =>
    expect(() => {
      shallow(<LinkMenuItem icon={<IconComponent />} title="Foo title" />)
    }).toThrow())

  it('should use title as fallback w/o titleLong', () => {
    const wrapper = shallow(<LinkMenuItem icon={<IconComponent />} href="/foo" title="Foo title" />)
    expect(wrapper.find('a').prop('title')).toBe('Foo title')
  })
})
