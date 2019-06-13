import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import Drawer from 'antd/lib/drawer'

import SectionLink from '../../SectionLink'
import { Header } from './Header'
import Nav from './Nav'
import Logo from './Logo'
import SearchInput from './SearchInput'

describe('<Header />', () => {
  const course = { homeLink: 'foo' }

  it('should render with sidebar visible', () => {
    const wrapper = shallow(
      <Header
        course={course}
        disableSidebar={false}
        dispatchToggleSidebar={() => {}}
        sidebarVisible
      />
    )
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
    expect(wrapper.find(SectionLink)).toHaveLength(1)
    expect(wrapper.find(Logo)).toHaveLength(1)
    expect(wrapper.find(Drawer).exists()).toBe(true)
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find(SearchInput)).toHaveLength(2)
    expect(wrapper.find(Nav)).toHaveLength(2)
  })

  it('should render with sidebar not visible', () => {
    const wrapper = shallow(
      <Header
        course={course}
        disableSidebar={false}
        dispatchToggleSidebar={() => {}}
        sidebarVisible
      />
    )
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
    expect(wrapper.find(SectionLink)).toHaveLength(1)
    expect(wrapper.find(Logo)).toHaveLength(1)
    expect(wrapper.find(Drawer).exists()).toBe(true)
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find(SearchInput)).toHaveLength(2)
    expect(wrapper.find(Nav)).toHaveLength(2)
  })

  it('should render w/o sidebar', () => {
    const wrapper = shallow(
      <Header
        course={course}
        disableSidebar
        dispatchToggleSidebar={() => {}}
        sidebarVisible={false}
      />
    )
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
    expect(wrapper.find(Button)).toHaveLength(1)
  })

  it('should dispatch toggleSidebar', () => {
    const mockDispatchToggleSidebar = jest.fn()
    const wrapper = shallow(
      <Header
        course={course}
        disableSidebar={false}
        dispatchToggleSidebar={mockDispatchToggleSidebar}
        sidebarVisible
      />
    )
    wrapper.find(Button).at(0).simulate('click')
    expect(mockDispatchToggleSidebar.mock.calls).toHaveLength(1)
  })

  it('should render without home link', () => {
    const wrapper = shallow(
      <Header
        course={{}}
        disableSidebar={false}
        dispatchToggleSidebar={() => {}}
        sidebarVisible
      />
    )
    expect(wrapper.find(SectionLink)).toHaveLength(0)
  })
})
