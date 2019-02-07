import React from 'react'
import { shallow } from 'enzyme'

import { AboutPage } from './about'
import Layout from '../components/Layout'

describe('<AboutPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<AboutPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).not.toBe(true)
  })
})
