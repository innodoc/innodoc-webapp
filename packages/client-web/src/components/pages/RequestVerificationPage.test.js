import React from 'react'
import { shallow } from 'enzyme'

import RequestVerificationPage from './RequestVerificationPage'
import Layout from '../Layout'
import RequestVerificationForm from '../user/RequestVerificationForm'

describe('<RequestVerificationPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RequestVerificationPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(RequestVerificationForm).exists()).toBe(true)
  })
})
