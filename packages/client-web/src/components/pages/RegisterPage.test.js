import React from 'react'
import { shallow } from 'enzyme'

import RegisterPage from './RegisterPage'
import Layout from '../Layout'
import RegisterForm from '../user/RegisterForm'

describe('<RegisterPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RegisterPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    const registerForm = layout.find(RegisterForm)
    expect(registerForm.exists()).toBe(true)
  })
})
