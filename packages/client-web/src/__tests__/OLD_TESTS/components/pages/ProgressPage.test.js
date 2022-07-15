import React from 'react'
import { shallow } from 'enzyme'

import ProgressPage from './ProgressPage'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import UserProgress from '../user/Progress'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'

jest.mock('@innodoc/common/src/i18n')

describe('<ProgressPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<ProgressPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(false)
    expect(wrapper.find(PageTitle).prop('children')).toBe('progress.title')
    expect(layout.find(UserProgress).exists()).toBe(true)
    expect(wrapper.exists(SidebarToggleButton)).toBe(true)
  })
})
