import React from 'react'
import { shallow } from 'enzyme'

import ChangePasswordPage from './ChangePasswordPage'
import Layout from '../Layout'
import ChangePasswordForm from '../user/ChangePasswordForm'

describe('<ChangePasswordPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<ChangePasswordPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(ChangePasswordForm).exists()).toBe(true)
  })
})