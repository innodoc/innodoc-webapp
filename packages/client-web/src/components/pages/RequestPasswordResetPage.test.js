import React from 'react'
import { shallow } from 'enzyme'

import RequestPasswordResetPage from './RequestPasswordResetPage'
import Layout from '../Layout'
import RequestPasswordResetForm from '../user/RequestPasswordResetForm'

describe('<RequestPasswordResetPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RequestPasswordResetPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(RequestPasswordResetForm).exists()).toBe(true)
  })
})
