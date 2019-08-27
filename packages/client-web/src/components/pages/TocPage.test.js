import React from 'react'
import { shallow } from 'enzyme'

import TocPage from './TocPage'
import Layout from '../Layout'
import Toc from '../Toc'

describe('<TocPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<TocPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    const toc = layout.find(Toc)
    expect(toc.exists()).toBe(true)
    expect(toc.prop('expandAll')).toBe(true)
  })
})
