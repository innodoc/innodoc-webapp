import React from 'react'
import { shallow } from 'enzyme'

import ResultsPage from './ResultsPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import UserResults from '../user/Results'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'

describe('<ResultsPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<ResultsPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(false)
    expect(wrapper.find(PageTitle).prop('children')).toBe('results.title')
    expect(layout.find(UserResults).exists()).toBe(true)
    expect(wrapper.exists(SidebarToggleButton)).toBe(true)
  })
})
