import React from 'react'
import { shallow } from 'enzyme'
import { Icon, List } from 'antd'

import Link from './Link'
import css from './style.sss'

describe('<Footer />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Link renderLink={() => <span />} title="Foo link" />
    )
    expect(wrapper.exists(List.Item)).toBe(true)
    const icon = wrapper.find(Icon)
    expect(icon.prop('type')).toBe('border')
    const a = wrapper.find('a')
    expect(a.prop('title')).toBe('Foo link')
    expect(a.text()).toMatch('Foo link')
    expect(a.hasClass(css.active)).toBe(false)
  })

  it('should render with active class', () => {
    const wrapper = shallow(
      <Link active renderLink={() => <span />} title="Foo" />
    )
    expect(wrapper.find('a').hasClass(css.active)).toBe(true)
  })

  it('should render with icon', () => {
    const wrapper = shallow(
      <Link iconType="foo-icon" renderLink={() => <span />} title="Foo" />
    )
    const icon = wrapper.find(Icon)
    expect(icon.prop('type')).toBe('foo-icon')
  })

  it('should render with short title', () => {
    const wrapper = shallow(
      <Link
        renderLink={() => <span />}
        shortTitle="shortshort"
        title="longlong"
      />
    )
    const a = wrapper.find('a')
    expect(a.prop('title')).toBe('longlong')
    expect(a.text()).toMatch('shortshort')
  })
})
