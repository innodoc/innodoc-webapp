import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'antd'
import { BorderOutlined, MenuOutlined } from '@ant-design/icons'

import Link from './Link'
import css from './style.sss'

describe('<Footer />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Link renderLink={() => <span />} title="Foo link" />
    )
    expect(wrapper.exists(List.Item)).toBe(true)
    expect(wrapper.exists(BorderOutlined)).toBe(true)
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
      <Link icon={<MenuOutlined />} renderLink={() => <span />} title="Foo" />
    )
    expect(wrapper.exists(MenuOutlined)).toBe(true)
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
