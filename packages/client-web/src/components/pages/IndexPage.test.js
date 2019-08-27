import React from 'react'
import { shallow } from 'enzyme'

import IndexPage from './IndexPage'
import Layout from '../Layout'
import Index from '../Index'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'

describe('<IndexPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<IndexPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(false)
    expect(layout.find(Index).exists()).toBe(true)
    expect(wrapper.exists(SidebarToggleButton)).toBe(true)
  })
})
