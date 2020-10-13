import React from 'react'
import { shallow } from 'enzyme'

import Layout from '../Layout'
import Index from '../Index'
import PageTitle from '../PageTitle'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import IndexPage from './IndexPage'

jest.mock('@innodoc/common/src/i18n')

describe('<IndexPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<IndexPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(false)
    expect(layout.find(Index).exists()).toBe(true)
    expect(wrapper.exists(SidebarToggleButton)).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('index.title')
  })
})
