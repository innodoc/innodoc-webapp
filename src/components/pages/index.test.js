import React from 'react'
import { shallow } from 'enzyme'

import { IndexPage } from './index'
import Layout from '../Layout'
import Toc from '../Toc'

describe('<IndexPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<IndexPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    const toc = layout.find(Toc)
    expect(toc.exists()).toBe(true)
    expect(toc.prop('expandAll')).toBe(true)
  })
})
