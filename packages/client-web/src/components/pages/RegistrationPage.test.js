import React from 'react'
import { shallow } from 'enzyme'

import RegistrationPage from './RegistrationPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import RegistrationForm from '../user/RegistrationForm'

describe('<RegistrationPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RegistrationPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    const registerForm = layout.find(RegistrationForm)
    expect(registerForm.exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.registration.title')
  })
})
